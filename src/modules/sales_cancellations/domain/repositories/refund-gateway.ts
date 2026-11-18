import type {
  CancellationAccount, CancellationDisposition, CancellationRefund
} from '../cancellation.types'

/** Reuses the EXISTING sale_refunds transaction engine. No second money writer. */
export interface CancellationRefundGateway {
  list(reference: string): Promise<CancellationRefund[]>
  accounting(reference: string): Promise<CancellationAccount>
  request(input: {
    saleReference: string
    scope: 'FULL_REMAINING' | 'SELECTED'
    defaultDisposition?: CancellationDisposition | null
    items?: Array<{ shoppingCartId: string; quantity: number; disposition: CancellationDisposition }> | null
    reason: string
    idempotencyKey: string
    cashSessionId?: string | null
  }): Promise<CancellationRefund>
  confirmExternal(input: {
    refundId: string
    externalReference: string
    externallyVerified: boolean
    idempotencyKey: string
  }): Promise<CancellationRefund>
  withdraw(input: {
    refundId: string
    reason: string
    idempotencyKey: string
  }): Promise<CancellationRefund>
  getById(refundId: string): Promise<CancellationRefund | null>
  findByKey(key: string): Promise<CancellationRefund | null>
}
