/** Pure settlement-date audit; all amounts are integer centésimas of COP. */
export interface RefundSettlementSource {
  refundId: string
  saleId: string
  saleReference: string
  status: string
  requestedAt: string
  confirmedAt: string | null
  amountMinor: string
  paymentId: string | null
  originalPaymentId: string
  originalPaymentKind: string | null
  originalPaymentDirection: string | null
  originalPaymentStatus: string | null
  paymentDirection: string | null
  paymentStatus: string | null
  paymentAmountMinor: string | null
  paymentSettlementMinor: string | null
  paymentRoundingMinor: string | null
  cashTenderedMinor: string | null
  cashChangeMinor: string | null
  paymentOriginalId: string | null
  paymentSaleId: string | null
  paymentKind: string | null
  paymentSessionId: string | null
  paymentStoreId: string | null
  originalPaymentStoreId: string | null
  movementId: string | null
  movementDirection: string | null
  movementType: string | null
  movementAmountMinor: string | null
  movementSessionId: string | null
  movementStoreId: string | null
}
export interface RefundSettlementAudit {
  refundId: string
  saleId: string
  saleReference: string
  requestedAt: string
  confirmedAt: string
  amountMinor: string
  paymentKind: string
  paymentId: string | null
  accountingVerified: boolean
  providerVerified: boolean
  issues: string[]
}
const monetary = (value: unknown): bigint | null =>
  typeof value === 'string' && /^(0|[1-9]\d*)$/.test(value) && BigInt(value) <= 9007199254740991n ? BigInt(value) : null

/** Never interpret a manual operator confirmation as provider-side verification. */
export function verifyRefundSettlement(rows: readonly RefundSettlementSource[], storeId: string): RefundSettlementAudit[] {
  const buckets = new Map<string, RefundSettlementSource[]>()
  for (const row of rows) buckets.set(row.refundId, [...(buckets.get(row.refundId) ?? []), row])
  return [...buckets.entries()].map(([refundId, group]) => {
    const first = group[0]
    const issues = new Set<string>()
    const amount = monetary(first.amountMinor)
    if (first.status !== 'COMPLETED' || !first.confirmedAt) issues.add('REFUND_NOT_COMPLETED')
    if (amount === null) issues.add('REFUND_AMOUNT_INVALID')
    if (!first.paymentId || first.paymentDirection !== 'REFUND' || first.paymentStatus !== 'CONFIRMED') issues.add('REFUND_PAYMENT_MISSING_OR_INVALID')
    if (first.paymentOriginalId !== first.originalPaymentId || first.paymentSaleId !== first.saleId) issues.add('REFUND_PAYMENT_LINK_INVALID')
    if (first.paymentStoreId !== storeId || first.originalPaymentStoreId !== storeId) issues.add('REFUND_TENANT_MISMATCH')
    if (first.originalPaymentDirection !== 'COLLECTION' || first.originalPaymentStatus !== 'CONFIRMED') issues.add('REFUND_ORIGINAL_COLLECTION_INVALID')
    if (first.paymentKind !== first.originalPaymentKind) issues.add('REFUND_METHOD_MISMATCH')
    if (amount === null || monetary(first.paymentAmountMinor) !== amount) issues.add('REFUND_AMOUNT_MISMATCH')
    const settled = monetary(first.paymentSettlementMinor)
    const rounded = first.paymentRoundingMinor == null ? null : /^-?(0|[1-9]\d*)$/.test(first.paymentRoundingMinor)
      ? BigInt(first.paymentRoundingMinor) : null
    if (amount === null || settled === null || rounded === null || amount + rounded !== settled)
      issues.add('REFUND_SETTLEMENT_ARITHMETIC')
    if (first.paymentKind === 'CASH') {
      const tendered = monetary(first.cashTenderedMinor), change = monetary(first.cashChangeMinor)
      if (tendered === null || change === null || settled === null || tendered - change !== settled)
        issues.add('REFUND_CASH_TENDERED_MISMATCH')
    } else if (first.cashTenderedMinor !== null || first.cashChangeMinor !== null || rounded !== 0n) {
      issues.add('REFUND_NONCASH_CHANGE_INVALID')
    }
    const movementIds = group.filter(r => r.movementId).map(r => r.movementId!)
    if (new Set(movementIds).size !== movementIds.length) issues.add('REFUND_MOVEMENT_DUPLICATE')
    if (first.paymentKind === 'CASH') {
      if (amount !== 0n && movementIds.length !== 1) issues.add('REFUND_CASH_MOVEMENT_COUNT')
      if (amount === 0n && movementIds.length !== 0) issues.add('REFUND_CASH_ZERO_MOVEMENT')
      for (const m of group.filter(r => r.movementId)) {
        if (m.movementType !== 'REFUND_CASH' || m.movementDirection !== 'OUT' ||
          m.movementStoreId !== storeId || m.movementSessionId !== first.paymentSessionId ||
          monetary(m.movementAmountMinor) !== settled) issues.add('REFUND_CASH_MOVEMENT_MISMATCH')
      }
    } else if (movementIds.length) issues.add('REFUND_NONCASH_HAS_CASH_MOVEMENT')
    for (const duplicate of group.slice(1)) {
      if (duplicate.paymentId !== first.paymentId || duplicate.amountMinor !== first.amountMinor ||
        duplicate.originalPaymentId !== first.originalPaymentId) issues.add('REFUND_DUPLICATE_HEADER')
    }
    return { refundId, saleId: first.saleId, saleReference: first.saleReference, requestedAt:first.requestedAt,
      confirmedAt: first.confirmedAt ?? '', amountMinor: first.amountMinor,
      paymentKind: first.paymentKind ?? 'UNKNOWN', paymentId: first.paymentId,
      accountingVerified: issues.size === 0, providerVerified: false, issues: [...issues] }
  })
}

export function summarizeRefundSettlements(rows: readonly RefundSettlementAudit[]) {
  let confirmed = 0n
  let unverified = 0n
  for (const row of rows) {
    const value = monetary(row.amountMinor)
    if (row.accountingVerified && value !== null) confirmed += value
    else if (value !== null) unverified += value
  }
  return {
    confirmedVerifiedMinor: confirmed.toString(),
    excludedUnverifiedMinor: unverified.toString(),
    confirmedCount: rows.filter(r => r.accountingVerified).length,
    unverifiedCount: rows.filter(r => !r.accountingVerified).length
  }
}
