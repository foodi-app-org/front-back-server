import type { Actor } from '../../cash_management/application/use-cases/cash-operations'
import { find } from '../../cash_management/application/use-cases/cash-operations'
import { CashError, requireRule } from '../../cash_management/domain/services/cash-money'
import { PaymentPolicyError } from '../../cash_management/domain/session-payment-policy'
import type { CashRepository, TransactionPort } from '../../cash_management/domain/repositories/cash.repository'
import {
  assertSaleReplay,
  preparePayment,
  recordPayment,
  type PreparedPayment
} from '../../payments/application/use-cases/register-sale-payment'
import type { SalePaymentInput } from '../../payments/domain/entities/sale-payment.entity'

export type FinancialSaleRequest = {
  pCodeRef: string
  payId: string
  cashSessionId?: string | null
  paymentInput?: SalePaymentInput | null
}

type ExistingSaleIdentity = { stPId: string; idStore: string; pCodeRef: string }

/**
 * Port used by sale orchestration. Cash Management supplies the implementation.
 * All reads must share the caller's existing transaction (no nested transaction).
 */
export interface SessionPaymentAuthorizer {
  execute(input: {
    storeId: string
    sessionId: string
    payId: string
    transaction: TransactionPort
  }): Promise<void>
}

/** Application-level orchestration. No GraphQL, Sequelize or monetary math here. */
export class SalePaymentRegistration {
  constructor(
    private readonly repository: CashRepository,
    private readonly actor: Actor,
    private readonly request: FinancialSaleRequest,
    private readonly paymentAuthorizer: SessionPaymentAuthorizer
  ) {
    requireRule(repository.idStore === actor.storeId, 'FORBIDDEN', 'Comercio inválido')
    requireRule(request.cashSessionId && request.paymentInput,
      'PAYMENT_EVIDENCE_REQUIRED', 'Confirma el pago y selecciona una sesión de caja')
    requireRule(paymentAuthorizer && typeof paymentAuthorizer.execute === 'function',
      'PAYMENT_AUTHORIZATION_REQUIRED', 'No está disponible la autorización del medio de pago')
  }

  /** Do not use the legacy lookup, which can mask storage errors as not found. */
  async findVerifiedReplay(): Promise<ExistingSaleIdentity | null> {
    const read = async (tx: TransactionPort) => {
      const sale = await find<ExistingSaleIdentity>(tx, 'orders_statuses', this.actor.storeId,
        'pCodeRef', this.request.pCodeRef)
      if (!sale) return null
      requireRule(sale.stPId && sale.idStore === this.actor.storeId && sale.pCodeRef === this.request.pCodeRef,
        'IDEMPOTENCY_CONFLICT', 'La referencia de venta no coincide')
      const payment = await assertSaleReplay(tx, this.actor, sale.stPId, this.request, this.request.paymentInput)
      requireRule(payment.direction === 'COLLECTION' && payment.sessionId === this.request.cashSessionId &&
        payment.payId === this.request.payId && payment.actorId === this.actor.id,
      'IDEMPOTENCY_CONFLICT', 'La evidencia de pago no coincide con el intento original')
      return sale
    }
    return this.repository.read ? this.repository.read(read) : this.repository.transaction(read)
  }

  /**
   * Invoked by registerSalesStore INSIDE its managed Sequelize transaction.
   * The financial module must never commit separately.
   * Order of operations is important: first lock/validate payment; then enforce
   * session policy; only then can status_order write inventory and sale rows.
   */
  async prepare(transaction: unknown): Promise<{ tx: TransactionPort; payment: PreparedPayment }> {
    const tx = this.repository.bind(transaction)
    const payment = await preparePayment(tx, this.actor, this.request.cashSessionId,
      this.request.payId, this.request.paymentInput, this.request)

    try {
      await this.paymentAuthorizer.execute({
        storeId: this.actor.storeId,
        sessionId: payment.session.id,
        payId: payment.method.payId,
        transaction: tx
      })
    } catch (error) {
      // Translate ONLY domain denials. Storage/network failures remain ambiguous
      // and must NOT be presented as a definitive payment rejection.
      if (error instanceof PaymentPolicyError) {
        throw new CashError('PAYMENT_METHOD_NOT_ALLOWED', error.message)
      }
      throw error
    }

    return { tx, payment }
  }

  async record(prepared: Awaited<ReturnType<SalePaymentRegistration['prepare']>>,
    saleId: string | null | undefined, checkoutTotal: unknown, headerChange: unknown): Promise<void> {
    requireRule(saleId, 'SALE_ID_REQUIRED', 'No se encontró el identificador de la venta')
    await recordPayment(prepared.tx, prepared.payment, saleId, checkoutTotal, headerChange)
  }
}
