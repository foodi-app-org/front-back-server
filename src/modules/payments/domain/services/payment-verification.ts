import { asMinor, nonnegative, signedMinor, ZERO, requireRule } from '../../../cash_management/domain/services/cash-money'
import type { SalePayment } from '../entities/sale-payment.entity'
import type { CashMovement } from '../../../cash_management/domain/entities/cash.entity'

/**
 * Verify a sale OR a cash-session ledger without corrupting cross-session refunds.
 * originalPayments: read-only references to original collections in OTHER sessions.
 * Those are used only for REFUND parent validation and never counted in this session.
 */
export function verifyPayments(
  expected: unknown,
  payments: readonly SalePayment[],
  movements: readonly CashMovement[],
  originalPayments: readonly SalePayment[] = []
) {
  const issues: string[] = [], postingIssues: string[] = []
  let applied = ZERO, settled = ZERO, rounding = ZERO, refund = ZERO, refundPhysical = ZERO
  let confirmed = 0, cash = 0
  const ids = new Set<string>()
  const known = new Map<string, SalePayment>([...originalPayments, ...payments].map(p => [p.id, p]))
  const linked = new Map<string, CashMovement[]>()
  const localPaymentIds = new Set(payments.map(p => p.id))
  for (const m of movements) {
    if (!m.paymentId || !localPaymentIds.has(m.paymentId)) {
      postingIssues.push('ORPHAN_PAYMENT_MOVEMENT')
      continue
    }
    linked.set(m.paymentId, [...(linked.get(m.paymentId) ?? []), m])
  }
  for (const p of payments) {
    try {
      requireRule(!ids.has(p.id), 'DUPLICATE_PAYMENT', 'Duplicate')
      ids.add(p.id)
      const items = linked.get(p.id) ?? []
      if (p.status !== 'CONFIRMED') {
        if (items.length) postingIssues.push('UNCONFIRMED_PAYMENT_POSTED')
        continue
      }
      confirmed++
      const a = nonnegative(p.amountAppliedMinor), s = nonnegative(p.settlementAmountMinor)
      const r = signedMinor(p.roundingDeltaMinor)
      requireRule(a + r === s, 'PAYMENT_ARITHMETIC', 'Arithmetic')
      if (p.direction === 'COLLECTION') {
        applied += a; settled += s; rounding += r
      } else {
        const original = known.get(p.originalPaymentId ?? '')
        requireRule(original && original.direction === 'COLLECTION' && original.status === 'CONFIRMED' &&
          original.idStore === p.idStore && original.saleId === p.saleId &&
          original.paymentKind === p.paymentKind,
        'REFUND_ORPHAN', 'Refund not tied to original collection')
        refund += a
        refundPhysical += s
      }
      if (p.paymentKind === 'CASH') {
        requireRule(nonnegative(p.cashTenderedMinor) - nonnegative(p.cashChangeMinor) === s,
          'CHANGE_MISMATCH', 'Cash arithmetic')
        if (s > ZERO) {
          cash++
          if (items.length !== 1) postingIssues.push('CASH_MOVEMENT_COUNT')
          else {
            const m = items[0]
            if (m.sessionId !== p.sessionId || m.idStore !== p.idStore || m.currency !== 'COP' ||
              m.type !== (p.direction === 'COLLECTION' ? 'SALE_CASH' : 'REFUND_CASH') ||
              m.direction !== (p.direction === 'COLLECTION' ? 'IN' : 'OUT') ||
              nonnegative(m.amountMinor) !== s) postingIssues.push('CASH_MOVEMENT_MISMATCH')
          }
        } else if (items.length) postingIssues.push('ZERO_PAYMENT_POSTED')
      } else {
        requireRule(r === ZERO && p.cashTenderedMinor == null && p.cashChangeMinor == null,
          'NON_CASH_CHANGE', 'Noncash refund is not a physical cash movement')
        if (items.length) postingIssues.push('NON_CASH_POSTED')
      }
    } catch {
      issues.push('INVALID_PAYMENT')
      if (p.paymentKind === 'CASH') postingIssues.push('INVALID_CASH_PAYMENT')
    }
  }
  let expectedMinor: bigint | null = null
  try { if (expected !== null && expected !== undefined) expectedMinor = nonnegative(expected) }
  catch { issues.push('EXPECTED_INVALID') }
  // A cash session can refund sales from a DIFFERENT session, so refund > local applied is legal.
  // The over-refund test is meaningful only for a whole SALE report (expected != null).
  const paymentVerification = !confirmed ? (issues.length ? 'MISMATCH' : 'UNVERIFIABLE')
    : issues.length || (expectedMinor !== null && refund > applied) ||
      (expectedMinor !== null && applied > expectedMinor) ? 'MISMATCH'
      : expectedMinor === null ? 'UNVERIFIABLE'
        : applied < expectedMinor ? 'PARTIAL' : 'MATCHED'
  return {
    paymentVerification,
    cashPostingVerification: postingIssues.length ? 'MISMATCH' : !confirmed ? 'UNVERIFIABLE' :
      !cash ? 'NOT_APPLICABLE' : 'MATCHED',
    issues: [...new Set(issues)], postingIssues: [...new Set(postingIssues)], confirmed,
    appliedMinor: asMinor(applied), settledMinor: asMinor(settled), roundingMinor: asMinor(rounding),
    refundMinor: asMinor(refund), refundPhysicalMinor: asMinor(refundPhysical),
    differenceMinor: expectedMinor === null || !confirmed ? null : asMinor(applied - expectedMinor)
  }
}
