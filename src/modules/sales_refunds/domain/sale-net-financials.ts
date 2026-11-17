/** Projection for one original sale. Amounts are centésimas, NOT COP decimals. */
export type RefundFinancialRow = {
  id: string
  saleId: string
  status: 'PENDING_EXTERNAL' | 'COMPLETED' | 'CANCELLED'
  amountMinor: string
  confirmedAt: string | null
}
export type NetSaleFinancials = {
  saleId: string
  originalMerchandiseMinor: string
  confirmedRefundMinor: string
  pendingRefundMinor: string
  cancelledRefundMinor: string
  effectiveMerchandiseMinor: string
  confirmedRefundCount: number
  pendingRefundCount: number
  cancelledRefundCount: number
}
const MAX = 9007199254740991n
function amount(value: unknown): bigint {
  if (typeof value !== 'string' || !/^(0|[1-9]\d*)$/.test(value)) {
    throw new Error('REFUND_FINANCIAL_AMOUNT_INVALID')
  }
  const n = BigInt(value)
  if (n > MAX) throw new Error('REFUND_FINANCIAL_AMOUNT_RANGE')
  return n
}

/** Keeps the original value intact. Pending/cancelled refunds never reduce realized sales. */
export function projectNetSaleFinancials(
  saleId: string,
  originalMerchandiseMinor: string,
  refunds: readonly RefundFinancialRow[]
): NetSaleFinancials {
  if (!saleId) throw new Error('REFUND_SALE_ID_REQUIRED')
  const original = amount(originalMerchandiseMinor)
  let confirmed = 0n
  let pending = 0n
  let cancelled = 0n
  let confirmedRefundCount = 0
  let pendingRefundCount = 0
  let cancelledRefundCount = 0
  const ids = new Set<string>()
  for (const refund of refunds) {
    if (refund.saleId !== saleId || !refund.id || ids.has(refund.id)) {
      throw new Error('REFUND_FINANCIAL_SCOPE_MISMATCH')
    }
    ids.add(refund.id)
    const minor = amount(refund.amountMinor)
    switch (refund.status) {
      case 'COMPLETED':
        if (!refund.confirmedAt) throw new Error('REFUND_FINANCIAL_CONFIRMATION_MISSING')
        confirmed += minor
        confirmedRefundCount++
        break
      case 'PENDING_EXTERNAL':
        pending += minor
        pendingRefundCount++
        break
      case 'CANCELLED':
        cancelled += minor
        cancelledRefundCount++
        break
      default:
        throw new Error('REFUND_FINANCIAL_STATUS_INVALID')
    }
  }
  if (confirmed + pending > original) throw new Error('REFUND_FINANCIAL_OVERALLOCATED')
  return {
    saleId,
    originalMerchandiseMinor: original.toString(),
    confirmedRefundMinor: confirmed.toString(),
    pendingRefundMinor: pending.toString(),
    cancelledRefundMinor: cancelled.toString(),
    effectiveMerchandiseMinor: (original - confirmed).toString(),
    confirmedRefundCount, pendingRefundCount, cancelledRefundCount
  }
}
