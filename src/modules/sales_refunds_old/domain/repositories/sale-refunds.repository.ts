import type { SaleRefund, SaleRefundItem, RefundStatus, RefundDisposition } from '../refund.entity'

export interface SoldRefundLine {
  lineId: string
  soldProductId: string
  productName: string
  catalogProductId: string
  soldQuantity: number
  grossMinor: bigint
  extras: { catalogExtraId: string; soldQuantity: number }[]
}
export interface RefundOriginalPayment {
  id: string
  saleId: string
  sessionId: string
  payId: string
  name: string
  paymentKind: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'DIGITAL_WALLET' | 'OTHER'
  amountAppliedMinor: bigint
  settlementAmountMinor: bigint
  policySnapshot: string
}
export interface RefundSaleSnapshot {
  id: string
  reference: string
  grossMinor: bigint
  netMinor: bigint
  lines: SoldRefundLine[]
  payment: RefundOriginalPayment
}
export type StoredRefund = SaleRefund & { items: SaleRefundItem[] }

export interface RefundWork {
  loadSale(reference: string): Promise<RefundSaleSnapshot>
  lockSale(reference: string): Promise<void>
  getRefund(refundId: string): Promise<StoredRefund | null>
  findByKey(idempotencyKey: string): Promise<StoredRefund | null>
  listSaleRefunds(saleId: string): Promise<StoredRefund[]>
  insertRefund(refund: SaleRefund, items: SaleRefundItem[]): Promise<void>
  markCompleted(refundId: string, info: { paymentId: string; confirmedBy: string; confirmedAt: string; externalReference: string | null; confirmationKey: string | null; confirmationHash: string | null }): Promise<void>
  markCancelled(refundId: string, info: { cancelledBy: string; cancelledAt: string; cancelReason: string; cancelKey: string; cancelHash: string }): Promise<void>
  /** Cash movement and payment evidence inserted in SAME transaction. */
  settleCash(refund: SaleRefund, original: RefundOriginalPayment, actorId: string): Promise<string>
  /** Called ONLY after operator has verified actual external settlement. */
  settleExternal(refund: SaleRefund, original: RefundOriginalPayment, actorId: string, externalReference: string): Promise<string>
  /** Refund-specific RESTOCK transaction with refund IDs in stock_history meta. */
  restoreStock(refund: SaleRefund, line: SoldRefundLine, refundItem: SaleRefundItem, previouslyReservedQty: number): Promise<void>
  loadDecision(refundId: string): Promise<{ status: RefundStatus; confirmationKey: string | null; confirmationHash: string | null; cancelKey: string | null; cancelHash: string | null } | null>
}
export interface SaleRefundsRepository {
  readonly idStore: string
  transaction<T>(fn: (work: RefundWork) => Promise<T>): Promise<T>
  read<T>(fn: (work: RefundWork) => Promise<T>): Promise<T>
}
