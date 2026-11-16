/** @jest-environment node */
import { find } from '../../cash_management/application/use-cases/cash-operations'
import type { CashRepository, TransactionPort } from '../../cash_management/domain/repositories/cash.repository'
import { assertSaleReplay, preparePayment, recordPayment } from '../../payments/application/use-cases/register-sale-payment'
import { SalePaymentRegistration, type FinancialSaleRequest } from '../../../../../../../../Downloads/venty-fix-registro-pagos/front-back-server/src/modules/status_order/application/sale-payment-registration'

jest.mock('../../cash_management/application/use-cases/cash-operations', () => ({ find: jest.fn() }))
jest.mock('../../payments/application/use-cases/register-sale-payment', () => ({
  assertSaleReplay: jest.fn(), preparePayment: jest.fn(), recordPayment: jest.fn()
}))

const actor = { id: 'operator-1', storeId: 'store-1' }
const identity = { stPId: 'sale-1', idStore: actor.storeId, pCodeRef: 'T-123' }
const request: FinancialSaleRequest & { input: Array<{ pId: string }> } = {
  pCodeRef: identity.pCodeRef, payId: 'mastercard', cashSessionId: 'session-1', input: [{ pId: 'product-1' }],
  paymentInput: { methodId: 'mastercard', amountApplied: '5000.00', idempotencyKey: 'payment:T-123', confirmed: true }
}
const evidence = { direction: 'COLLECTION', actorId: actor.id, sessionId: request.cashSessionId, payId: request.payId }

function fixture() {
  const tx: TransactionPort = {
    table: name => name,
    query: async <T>() => [] as T[],
    exec: async () => undefined
  }
  const transaction = { token: 'existing-sequelize-transaction' }
  const repository: CashRepository = {
    idStore: actor.storeId,
    bind: jest.fn(() => tx),
    read: async fn => fn(tx),
    transaction: async fn => fn(tx)
  }
  return { tx, transaction, repository, flow: new SalePaymentRegistration(repository, actor, request) }
}

describe('SalePaymentRegistration', () => {
  beforeEach(() => jest.resetAllMocks())

  it('rejects a controlled checkout without explicit payment evidence', () => {
    const { repository } = fixture()
    expect(() => new SalePaymentRegistration(repository, actor, { ...request, paymentInput: undefined }))
      .toThrow('Confirma el pago')
  })

  it('rejects a repository and actor belonging to different tenants', () => {
    const { repository } = fixture()
    expect(() => new SalePaymentRegistration(repository, { ...actor, storeId: 'other' }, request))
      .toThrow('Comercio inválido')
  })

  it('prepares and records payment using the caller transaction and entire original request', async () => {
    const { flow, repository, transaction, tx } = fixture()
    const payment = { token: 'prepared' }
    ;(preparePayment as jest.Mock).mockResolvedValue(payment)
    await flow.record(await flow.prepare(transaction), 'sale-1', '5000.00', 0)
    expect(repository.bind).toHaveBeenCalledWith(transaction)
    expect(preparePayment).toHaveBeenCalledWith(tx, actor, request.cashSessionId, request.payId, request.paymentInput, request)
    expect(recordPayment).toHaveBeenCalledWith(tx, payment, 'sale-1', '5000.00', 0)
  })

  it('propagates persistence failure so the outer transaction can roll back', async () => {
    const { flow, transaction } = fixture()
    ;(preparePayment as jest.Mock).mockResolvedValue({})
    ;(recordPayment as jest.Mock).mockRejectedValue(new Error('insert failed'))
    await expect(flow.record(await flow.prepare(transaction), 'sale-1', '5000.00', 0)).rejects.toThrow('insert failed')
  })

  it('does not persist payment before the sale has an identifier', async () => {
    const { flow, transaction } = fixture()
    ;(preparePayment as jest.Mock).mockResolvedValue({})
    await expect(flow.record(await flow.prepare(transaction), undefined, '5000.00', 0)).rejects.toThrow('identificador')
    expect(recordPayment).not.toHaveBeenCalled()
  })

  it('returns null only when the sale is not found', async () => {
    const { flow } = fixture()
    ;(find as jest.Mock).mockResolvedValue(null)
    await expect(flow.findVerifiedReplay()).resolves.toBeNull()
    expect(assertSaleReplay).not.toHaveBeenCalled()
  })

  it('returns existing sale only after verifying payment evidence and original request fingerprint', async () => {
    const { flow, tx } = fixture()
    ;(find as jest.Mock).mockResolvedValue(identity)
    ;(assertSaleReplay as jest.Mock).mockResolvedValue(evidence)
    await expect(flow.findVerifiedReplay()).resolves.toEqual(identity)
    expect(find).toHaveBeenCalledWith(tx, 'orders_statuses', actor.storeId, 'pCodeRef', request.pCodeRef)
    expect(assertSaleReplay).toHaveBeenCalledWith(tx, actor, identity.stPId, request, request.paymentInput)
    expect(recordPayment).not.toHaveBeenCalled()
  })

  it('never verifies a historical sale missing payment evidence', async () => {
    const { flow } = fixture()
    ;(find as jest.Mock).mockResolvedValue(identity)
    ;(assertSaleReplay as jest.Mock).mockRejectedValue(new Error('PAYMENT_EVIDENCE_REQUIRED'))
    await expect(flow.findVerifiedReplay()).rejects.toThrow('PAYMENT_EVIDENCE_REQUIRED')
    expect(recordPayment).not.toHaveBeenCalled()
  })

  it.each([{ sessionId: 'different' }, { actorId: 'different' }, { payId: 'different' }, { direction: 'REFUND' }])(
    'rejects incompatible replay evidence %j', async changed => {
      const { flow } = fixture()
      ;(find as jest.Mock).mockResolvedValue(identity)
      ;(assertSaleReplay as jest.Mock).mockResolvedValue({ ...evidence, ...changed })
      await expect(flow.findVerifiedReplay()).rejects.toThrow('evidencia de pago no coincide')
    }
  )

  it('does not turn database read failure into a missing sale', async () => {
    const { flow } = fixture()
    ;(find as jest.Mock).mockRejectedValue(new Error('database unavailable'))
    await expect(flow.findVerifiedReplay()).rejects.toThrow('database unavailable')
  })
})
