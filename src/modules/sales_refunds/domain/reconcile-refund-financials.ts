import { projectNetSaleFinancials, type RefundFinancialRow } from './sale-net-financials'

export type RefundLedgerRow = RefundFinancialRow & { paymentId: string | null }
export type RefundPaymentEvidence = {
  id: string
  saleId: string
  direction: string
  status: string
  amountAppliedMinor: string
}
export type RefundReconciliation = ReturnType<typeof projectNetSaleFinancials> & {
  verified: boolean
  issues: string[]
}

/** Independent verification: a completed refund must have exactly one matching payment.
 * This is a sale-date view, NOT a provider settlement or cash-drawer report. */
export function reconcileRefundFinancials(
  saleId: string,
  originalMerchandiseMinor: string,
  refunds: readonly RefundLedgerRow[],
  payments: readonly RefundPaymentEvidence[]
): RefundReconciliation {
  const projected = projectNetSaleFinancials(saleId, originalMerchandiseMinor, refunds)
  const issues: string[] = []
  const evidence = payments.filter(p => p.direction === 'REFUND' && p.status === 'CONFIRMED')
  const byId = new Map<string, RefundPaymentEvidence>()
  for (const payment of evidence) {
    if (!payment.id || byId.has(payment.id) || payment.saleId !== saleId) {
      issues.push('REFUND_PAYMENT_DUPLICATE_OR_FOREIGN')
    }
    byId.set(payment.id, payment)
  }
  const matched = new Set<string>()
  for (const refund of refunds) {
    if (refund.status !== 'COMPLETED') {
      if (refund.paymentId) issues.push('REFUND_UNCONFIRMED_HAS_PAYMENT')
      continue
    }
    if (!refund.paymentId) { issues.push('REFUND_PAYMENT_MISSING'); continue }
    if (matched.has(refund.paymentId)) issues.push('REFUND_PAYMENT_REUSED')
    matched.add(refund.paymentId)
    const payment = byId.get(refund.paymentId)
    if (!payment) { issues.push('REFUND_PAYMENT_MISSING'); continue }
    if (!/^(0|[1-9]\d*)$/.test(payment.amountAppliedMinor) ||
      payment.amountAppliedMinor !== refund.amountMinor) issues.push('REFUND_PAYMENT_AMOUNT_MISMATCH')
  }
  for (const payment of evidence) if (!matched.has(payment.id)) issues.push('REFUND_PAYMENT_ORPHAN')
  const uniqueIssues = [...new Set(issues)]
  return { ...projected, verified: uniqueIssues.length === 0, issues: uniqueIssues }
}

export function summarizeRefundFinancials(rows: readonly (RefundReconciliation | null)[]) {
  let original = 0n, confirmed = 0n, pending = 0n, effective = 0n, verified = 0, unverified = 0
  for (const row of rows) {
    if (!row) { unverified++; continue }
    if (!row.verified) { unverified++; continue } // Never aggregate unverified financial evidence.
    original += BigInt(row.originalMerchandiseMinor)
    confirmed += BigInt(row.confirmedRefundMinor)
    pending += BigInt(row.pendingRefundMinor)
    effective += BigInt(row.effectiveMerchandiseMinor)
    verified++
  }
  return {
    originalMerchandiseMinor: original.toString(),
    confirmedRefundMinor: confirmed.toString(),
    pendingRefundMinor: pending.toString(),
    effectiveMerchandiseMinor: effective.toString(),
    verifiedSales: verified,
    unverifiedSales: unverified
  }
}
