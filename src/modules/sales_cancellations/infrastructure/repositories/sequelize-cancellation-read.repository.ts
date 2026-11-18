import type { CashRepository, TransactionPort } from '@modules/cash_management/domain/repositories/cash.repository'
import { SequelizeCashRepository } from '@modules/cash_management/infrastructure/repositories/sequelize-cash.repository'
import { assertCancellation } from '../../domain/cancellation.policy'
import { verifyRefundSettlement, type RefundSettlementSource } from '@modules/sales_refunds/domain/refund-settlement-ledger'
import type { CancellationReadRepository } from '../../domain/repositories/cancellation.repository'
import type { CancellationCashProof, CancellationSettlementVerification, SaleCancellationSnapshot, SalePaymentRead } from '../../domain/cancellation.types'

type Header = {
  saleId: string; saleReference: string; historicalState: string | number
  netTotal: string | number | null; valueDelivery: string | number | null; tip: string | number | null
}
interface PaymentRow {
  id: string; paymentKind: string; direction: string; status: string
  amountAppliedMinor: string | number; settlementAmountMinor: string | number; sessionId: string
}
interface ProofRow {
  refundId: string; refundStatus: string; amountMinor: string | number
  paymentId: string | null; paymentKind: string | null; paymentStatus: string | null
  paymentDirection: string | null; paymentAmountMinor: string | number | null
  movementId: string | null; movementType: string | null
  movementDirection: string | null; movementAmountMinor: string | number | null
}

export class SequelizeCancellationReadRepository implements CancellationReadRepository {
  readonly storeId: string
  constructor(storeId: string, private readonly repo: CashRepository = new SequelizeCashRepository(storeId)) {
    assertCancellation(this.repo.idStore === storeId, 'CANCELLATION_TENANT_MISMATCH', 'Repositorio de comercio inválido')
    this.storeId = storeId
  }
  private read<T>(fn: (tx: TransactionPort) => Promise<T>): Promise<T> {
    return this.repo.read ? this.repo.read(fn) : this.repo.transaction(fn)
  }
  async inspectSale(reference: string): Promise<SaleCancellationSnapshot> {
    return this.read(async tx => {
      const rows = await tx.query<Header>(`SELECT o."stPId" AS "saleId", o."pCodeRef" AS "saleReference",
        t."state" AS "historicalState", o."netTotal", o."valueDelivery", o."tip"
        FROM ${tx.table('orders_statuses')} o
        INNER JOIN ${tx.table('order_status_types')} t ON t."idStatus"=o."idStatus"
        WHERE o."idStore"=:store AND o."pCodeRef"=:reference LIMIT 2`,
        { store: this.storeId, reference })
      assertCancellation(rows.length === 1, 'CANCELLATION_SALE_NOT_FOUND', 'Venta no encontrada o referencia ambigua')
      const header = rows[0]
      const payments = await tx.query<PaymentRow>(`SELECT "id","paymentKind","direction","status",
        "amountAppliedMinor","settlementAmountMinor","sessionId" FROM ${tx.table('sale_payments')}
        WHERE "idStore"=:store AND "saleId"=:saleId AND "direction"='COLLECTION' LIMIT 10`,
        { store: this.storeId, saleId: header.saleId })
      assertCancellation(payments.length < 10, 'CANCELLATION_PAYMENT_LIMIT', 'Demasiados cobros asociados; requiere revisión')
      type OriginalMovement = { paymentId: string; type: string; direction: string; amountMinor: string | number; sessionId: string }
      const movements = payments.length ? await tx.query<OriginalMovement>(`
        SELECT "paymentId","type","direction","amountMinor","sessionId"
        FROM ${tx.table('cash_movements')}
        WHERE "idStore"=:store AND "paymentId" IN (:ids) LIMIT 51`,
        { store: this.storeId, ids: payments.map(p => p.id) }) : []
      assertCancellation(movements.length <= 50, 'CANCELLATION_ORIGINAL_MOVEMENT_LIMIT',
        'Demasiados movimientos de cobro original')
      const out: SalePaymentRead[] = payments.map(p => {
        const linked = movements.filter(m => m.paymentId === p.id)
        const expected = BigInt(String(p.settlementAmountMinor))
        const cash = p.paymentKind === 'CASH'
        const expectedMovements = cash && expected > 0n ? 1 : 0
        return {
          id: p.id, kind: p.paymentKind, direction: p.direction, status: p.status,
          amountAppliedMinor: String(p.amountAppliedMinor), settlementAmountMinor: String(p.settlementAmountMinor),
          originalCashVerified: linked.length === expectedMovements && linked.every(m =>
            m.type === 'SALE_CASH' && m.direction === 'IN' && m.sessionId === p.sessionId &&
            String(m.amountMinor) === String(p.settlementAmountMinor))
        }
      })
      return {
        saleId: header.saleId, saleReference: header.saleReference,
        historicalState: Number(header.historicalState),
        merchandiseNetMinor: header.netTotal == null ? null : currencyToMinor(header.netTotal),
        deliveryMinor: header.valueDelivery == null ? null : currencyToMinor(header.valueDelivery),
        tipMinor: header.tip == null ? null : currencyToMinor(header.tip),
        payments: out
      }
    })
  }
  async getSettlementAudits(saleId: string): Promise<CancellationSettlementVerification[]> {
    return this.read(async tx => {
      // Exactly the same proof fields as refund-settlement-ledger.repository.ts;
      // scoped to one sale to avoid scanning unrelated periods/tenants.
      const records = await tx.query<RefundSettlementSource>(`SELECT
          r."id" AS "refundId", r."saleId", r."saleReference", r."status", r."requestedAt",
          r."confirmedAt", r."amountMinor", r."paymentId", r."originalPaymentId",
          op."paymentKind" AS "originalPaymentKind",
          op."direction" AS "originalPaymentDirection",
          op."status" AS "originalPaymentStatus",
          op."idStore" AS "originalPaymentStoreId",
          p."direction" AS "paymentDirection", p."status" AS "paymentStatus",
          p."amountAppliedMinor" AS "paymentAmountMinor",
          p."settlementAmountMinor" AS "paymentSettlementMinor",
          p."roundingDeltaMinor" AS "paymentRoundingMinor",
          p."cashTenderedMinor" AS "cashTenderedMinor",
          p."cashChangeMinor" AS "cashChangeMinor",
          p."originalPaymentId" AS "paymentOriginalId",
          p."saleId" AS "paymentSaleId", p."paymentKind",
          p."sessionId" AS "paymentSessionId", p."idStore" AS "paymentStoreId",
          m."id" AS "movementId", m."direction" AS "movementDirection",
          m."type" AS "movementType", m."amountMinor" AS "movementAmountMinor",
          m."sessionId" AS "movementSessionId", m."idStore" AS "movementStoreId"
        FROM ${tx.table('sale_refunds')} r
        LEFT JOIN ${tx.table('sale_payments')} p
          ON p."id"=r."paymentId" AND p."idStore"=r."idStore"
        LEFT JOIN ${tx.table('sale_payments')} op
          ON op."id"=r."originalPaymentId" AND op."idStore"=r."idStore"
        LEFT JOIN ${tx.table('cash_movements')} m
          ON m."paymentId"=p."id" AND m."idStore"=r."idStore"
        WHERE r."idStore"=:store AND r."saleId"=:saleId AND r."status"='COMPLETED'
        ORDER BY r."confirmedAt",r."id" LIMIT 1001`,
        { store: this.storeId, saleId })
      assertCancellation(records.length <= 1000, 'CANCELLATION_AUDIT_LIMIT',
        'Demasiados registros para conciliar automáticamente')
      const normalized = records.map(r => ({
        ...r, amountMinor: String(r.amountMinor),
        paymentAmountMinor: r.paymentAmountMinor == null ? null : String(r.paymentAmountMinor),
        paymentSettlementMinor: r.paymentSettlementMinor == null ? null : String(r.paymentSettlementMinor),
        paymentRoundingMinor: r.paymentRoundingMinor == null ? null : String(r.paymentRoundingMinor),
        cashTenderedMinor: r.cashTenderedMinor == null ? null : String(r.cashTenderedMinor),
        cashChangeMinor: r.cashChangeMinor == null ? null : String(r.cashChangeMinor),
        movementAmountMinor: r.movementAmountMinor == null ? null : String(r.movementAmountMinor),
        requestedAt: String(r.requestedAt),
        confirmedAt: r.confirmedAt == null ? null : String(r.confirmedAt)
      }))
      return verifyRefundSettlement(normalized, this.storeId).map(record => ({
        refundId: record.refundId,
        accountingVerified: record.accountingVerified,
        providerVerified: record.providerVerified,
        issues: record.issues
      }))
    })
  }
  async getCashProofs(saleId: string): Promise<CancellationCashProof[]> {
    return this.read(async tx => {
      const result = await tx.query<ProofRow>(`SELECT
          r."id" AS "refundId", r."status" AS "refundStatus", r."amountMinor" AS "amountMinor",
          r."paymentId" AS "paymentId", p."paymentKind", p."status" AS "paymentStatus",
          p."direction" AS "paymentDirection", p."amountAppliedMinor" AS "paymentAmountMinor",
          m."id" AS "movementId", m."type" AS "movementType",
          m."direction" AS "movementDirection", m."amountMinor" AS "movementAmountMinor"
        FROM ${tx.table('sale_refunds')} r
        LEFT JOIN ${tx.table('sale_payments')} p
          ON p."id"=r."paymentId" AND p."idStore"=r."idStore" AND p."saleId"=r."saleId"
        LEFT JOIN ${tx.table('cash_movements')} m
          ON m."paymentId"=p."id" AND m."idStore"=r."idStore"
        WHERE r."idStore"=:store AND r."saleId"=:saleId
        ORDER BY r."requestedAt",r."id" LIMIT 2001`,
        { store: this.storeId, saleId })
      assertCancellation(result.length <= 2000, 'CANCELLATION_AUDIT_LIMIT', 'Demasiados movimientos de devolución')
      return result.map(r => ({
        ...r, amountMinor: String(r.amountMinor),
        paymentAmountMinor: r.paymentAmountMinor === null ? null : String(r.paymentAmountMinor),
        movementAmountMinor: r.movementAmountMinor === null ? null : String(r.movementAmountMinor)
      }))
    })
  }
}

/** Amounts in orders_statuses are COP decimal, refunds/payment amounts are integer centésimas. */
function currencyToMinor(value: string | number): string {
  const s = String(value).trim()
  assertCancellation(/^(0|[1-9]\d*)(?:\.\d{1,2})?$/.test(s),
    'CANCELLATION_INVALID_AMOUNT', 'Valor de venta no expresable en centésimas COP')
  const [whole, fractional = ''] = s.split('.')
  const amount = BigInt(whole) * 100n + BigInt((fractional + '00').slice(0, 2))
  assertCancellation(amount <= 9007199254740991n, 'CANCELLATION_AMOUNT_OVERFLOW', 'Valor de venta fuera de rango')
  return amount.toString()
}
