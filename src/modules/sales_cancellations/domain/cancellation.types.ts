/**
 * Cancellation of a PAID sale means refunding all REMAINING MERCHANDISE.
 * It never erases the historical sale. No provider-side payment is inferred.
 */
export type CancellationDisposition = 'RESTOCK' | 'DAMAGED' | 'NO_STOCK'
export type CancellationStatus =
  | 'NOT_CONCLUDED'
  | 'RECONCILIATION_REQUIRED'
  | 'UNSUPPORTED_PAYMENT'
  | 'CHARGES_REQUIRE_MANUAL_RECONCILIATION'
  | 'PENDING_OTHER_REFUND'
  | 'ELIGIBLE'
  | 'PENDING_EXTERNAL'
  | 'FINANCIALLY_CANCELLED'
  | 'ALREADY_REFUNDED'
  | 'PENDING_WITHDRAWN'
  | 'ORDER_REJECTED'

export interface CancelSaleInput {
  saleReference: string
  reason: string
  idempotencyKey: string
  disposition: CancellationDisposition
  cashSessionId?: string | null
  /** Optional disposition per remaining sold line; must cover ALL remaining lines. */
  lineDispositions?: Array<{ shoppingCartId: string; disposition: CancellationDisposition }> | null
}
export interface CompleteExternalCancellationInput {
  refundId: string
  externalReference: string
  externallyVerified: boolean
  idempotencyKey: string
}
export interface WithdrawSaleCancellationInput {
  refundId: string
  reason: string
  idempotencyKey: string
}
export interface SalePaymentRead {
  id: string
  kind: string
  direction: string
  status: string
  amountAppliedMinor: string
  settlementAmountMinor: string
  originalCashVerified: boolean
}
export interface SaleCancellationSnapshot {
  saleId: string
  saleReference: string
  historicalState: number
  merchandiseNetMinor: string | null
  deliveryMinor: string | null
  tipMinor: string | null
  payments: SalePaymentRead[]
}
export interface CancellationRefund {
  id: string
  saleId: string
  saleReference: string
  status: 'PENDING_EXTERNAL' | 'COMPLETED' | 'CANCELLED'
  scope: 'FULL_REMAINING' | 'SELECTED'
  cashSessionId: string | null
  idempotencyKey: string
  reason: string
  amountMinor: string
  paymentId: string | null
  requestedAt: string
  requestedBy: string
  confirmedAt: string | null
  items: Array<{ shoppingCartId: string; quantity: number; disposition: CancellationDisposition }>
}
export interface CancellationAccount {
  commercialStatus: string
  originalMerchandiseMinor: string
  confirmedRefundMinor: string
  pendingRefundMinor: string
  effectiveMerchandiseMinor: string
  verified: boolean
  issues: string[]
  kardexVerified: boolean
  stockIssues: string[]
  lines: Array<{
    shoppingCartId: string
    productName: string
    soldQuantity: number
    returnedQuantity: number
    reservedQuantity: number
    remainingQuantity: number
    expectedRestockedQuantity: number
    restockedQuantity: number
    restockVerified: boolean
    extras: Array<{
      catalogId: string
      name: string
      soldQuantity: number
      expectedRestockedQuantity: number
      restockedQuantity: number
      restockVerified: boolean
    }>
  }>
}
/** A payment's cash-movement evidence (0, 1 or multiple rows). */
export interface CancellationCashProof {
  refundId: string
  refundStatus: string
  amountMinor: string
  paymentId: string | null
  paymentKind: string | null
  paymentStatus: string | null
  paymentDirection: string | null
  paymentAmountMinor: string | null
  movementId: string | null
  movementType: string | null
  movementDirection: string | null
  movementAmountMinor: string | null
}
export interface CancellationSettlementVerification {
  refundId: string
  accountingVerified: boolean
  providerVerified: boolean
  issues: string[]
}
export interface SaleCancellationView {
  saleId: string
  saleReference: string
  historicalState: number
  /** Authenticated operation registry; never inferred from mutable refund.reason. */
  operationId?: string | null
  operationPhase?: string | null
  fiscalStatus?: string | null
  cancellationStatus: CancellationStatus
  commercialStatus: string
  canRequest: boolean
  paymentKind: string | null
  originalMerchandiseMinor: string | null
  originalCollectedMinor: string | null
  excludedChargesMinor: string | null
  confirmedRefundMinor: string | null
  pendingRefundMinor: string | null
  effectiveMerchandiseMinor: string | null
  verified: boolean
  kardexVerified: boolean
  cashVerified: boolean
  providerVerified: boolean | null
  issues: string[]
  latestCancellationRefund: CancellationRefund | null
  lines: CancellationAccount['lines']
}
