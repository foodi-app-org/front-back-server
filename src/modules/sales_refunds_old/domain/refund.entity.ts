export type RefundStatus = 'PENDING_EXTERNAL' | 'COMPLETED' | 'CANCELLED'
export type RefundScope = 'FULL_REMAINING' | 'SELECTED'
export type RefundDisposition = 'RESTOCK' | 'DAMAGED'

export interface SaleRefund {
  id: string
  idStore: string
  saleId: string
  originalPaymentId: string
  saleReference: string
  cashSessionId: string | null
  status: RefundStatus
  scope: RefundScope
  amountMinor: string
  reason: string
  requestedBy: string
  requestedAt: string
  idempotencyKey: string
  requestHash: string
  confirmedBy: string | null
  confirmedAt: string | null
  paymentId: string | null
  externalReference: string | null
  cancelReason: string | null
  cancelledBy: string | null
  cancelledAt: string | null
}
export interface SaleRefundItem {
  id: string
  idStore: string
  refundId: string
  shoppingCartId: string
  quantity: number
  amountMinor: string
  disposition: RefundDisposition
}
export interface RefundLineRequest {
  shoppingCartId: string
  quantity: number
  disposition: RefundDisposition
}
export interface RequestSaleRefundInput {
  saleReference: string
  scope: RefundScope
  defaultDisposition?: RefundDisposition | null
  items?: RefundLineRequest[] | null
  cashSessionId?: string | null
  reason: string
  idempotencyKey: string
}
export interface ConfirmExternalSaleRefundInput {
  refundId: string
  externalReference: string
  externallyVerified: boolean
  idempotencyKey: string
}
export interface CancelSaleRefundInput {
  refundId: string
  reason: string
  idempotencyKey: string
}
