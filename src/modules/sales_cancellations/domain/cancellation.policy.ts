import type {
  CancellationAccount,
  CancellationCashProof, CancellationSettlementVerification,
  CancellationRefund,
  SaleCancellationSnapshot,
  SaleCancellationView
} from './cancellation.types'

export class CancellationError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
    this.name = 'CancellationError'
  }
}
export function assertCancellation(condition: unknown, code: string, message: string): asserts condition {
  if (!condition) throw new CancellationError(code, message)
}
const LIMIT = 9007199254740991n
export function minorUnits(raw: unknown, label: string): bigint {
  assertCancellation(typeof raw === 'string' && /^(0|[1-9]\d*)$/.test(raw),
    'CANCELLATION_INVALID_AMOUNT', `Valor monetario inválido: ${label}`)
  const amount = BigInt(raw)
  assertCancellation(amount <= LIMIT, 'CANCELLATION_AMOUNT_OVERFLOW', 'Valor fuera del rango contable')
  return amount
}
export function mandatoryText(raw: unknown, label: string, max: number): string {
  assertCancellation(typeof raw === 'string' && raw.trim().length > 0 && raw.trim().length <= max,
    'CANCELLATION_INVALID_INPUT', `${label} obligatorio (máximo ${max} caracteres)`)
  return raw.trim()
}
/** Checks immutable original payment before allowing the existing refund engine to act. */
export function validateCancelablePayment(snapshot: SaleCancellationSnapshot): {
  paymentKind: string
  collectedMinor: string
  excludedChargesMinor: string
} {
  assertCancellation(snapshot.historicalState === 4, 'CANCELLATION_NOT_CONCLUDED',
    'Esta operación no es una venta cobrada/concluida. No se puede anular por reembolso')
  const paid = snapshot.payments.filter(x => x.direction === 'COLLECTION' && x.status === 'CONFIRMED')
  const pending = snapshot.payments.filter(x => x.direction === 'COLLECTION' && x.status === 'PENDING')
  assertCancellation(paid.length === 1 && pending.length === 0, 'CANCELLATION_PAYMENT_UNSUPPORTED',
    'Se requiere un solo cobro original confirmado y ningún cobro pendiente. Los pagos mixtos requieren conciliación manual')
  assertCancellation(snapshot.merchandiseNetMinor !== null, 'CANCELLATION_LEGACY_SALE',
    'Esta venta histórica no tiene netTotal verificable')
  const net = minorUnits(snapshot.merchandiseNetMinor, 'netTotal')
  const delivery = snapshot.deliveryMinor == null ? 0n : minorUnits(snapshot.deliveryMinor, 'valueDelivery')
  const tip = snapshot.tipMinor == null ? 0n : minorUnits(snapshot.tipMinor, 'tip')
  const amount = minorUnits(paid[0].amountAppliedMinor, 'amountAppliedMinor')
  const settled = minorUnits(paid[0].settlementAmountMinor, 'settlementAmountMinor')
  assertCancellation(paid[0].originalCashVerified === true, 'CANCELLATION_ORIGINAL_CASH_NOT_RECONCILED',
    'El cobro original no concilia con los movimientos físicos de caja')
  assertCancellation(['CASH', 'CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'OTHER'].includes(paid[0].kind),
    'CANCELLATION_PAYMENT_UNSUPPORTED', 'Medio de pago sin clasificación financiera')
  // Refund v4 only reverses MERCHANDISE, never delivery, tip, external charges or rounding.
  // A full-sale cancellation must NOT silently leave part of the customer's payment unreturned.
  assertCancellation(amount === net && settled === net && delivery === 0n && tip === 0n,
    'CANCELLATION_CHARGES_REQUIRE_MANUAL_RECONCILIATION',
    'El cobro incluye conceptos fuera de mercancía o redondeo. Deben conciliarse antes de una cancelación total')
  return { paymentKind: paid[0].kind, collectedMinor: amount.toString(), excludedChargesMinor: '0' }
}

export function verifyCashRefundEvidence(
  refunds: readonly CancellationRefund[], proofs: readonly CancellationCashProof[]
): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  const byRefund = new Map<string, CancellationCashProof[]>()
  for (const proof of proofs) {
    byRefund.set(proof.refundId, [...(byRefund.get(proof.refundId) ?? []), proof])
  }
  for (const refund of refunds.filter(r => r.status === 'COMPLETED')) {
    const rows = byRefund.get(refund.id) ?? []
    const p = rows[0]
    if (!p || !p.paymentId || p.paymentId !== refund.paymentId ||
      p.paymentStatus !== 'CONFIRMED' || p.paymentDirection !== 'REFUND' ||
      p.paymentAmountMinor !== refund.amountMinor) {
      issues.push(`CANCELLATION_PAYMENT_EVIDENCE:${refund.id}`)
      continue
    }
    const recorded = rows.filter(x => x.movementId !== null)
    if (p.paymentKind === 'CASH') {
      const expectedCount = minorUnits(refund.amountMinor, 'refund.amountMinor') > 0n ? 1 : 0
      if (recorded.length !== expectedCount || recorded.some(x =>
        x.movementType !== 'REFUND_CASH' || x.movementDirection !== 'OUT' ||
        x.movementAmountMinor !== refund.amountMinor
      )) issues.push(`CANCELLATION_CASH_MOVEMENT:${refund.id}`)
    } else if (recorded.length) {
      issues.push(`CANCELLATION_EXTERNAL_WITH_CASH_MOVEMENT:${refund.id}`)
    }
  }
  return { valid: issues.length === 0, issues }
}

export function projectCancellation(input: {
  snapshot: SaleCancellationSnapshot
  refunds: readonly CancellationRefund[]
  accounting: CancellationAccount | null
  proofs: readonly CancellationCashProof[]
  settlements: readonly CancellationSettlementVerification[]
  /** IDs selected from trusted sale_cancellation_operations; NEVER client-controlled markers. */
  cancellationRefundIds?: readonly string[]
}): SaleCancellationView {
  const { snapshot, refunds, accounting, proofs, settlements } = input
  const issues: string[] = []
  const trustedIds = new Set(input.cancellationRefundIds ?? [])
  const applicable = refunds.filter(refund => trustedIds.has(refund.id)).sort((a,b) =>
    a.requestedAt.localeCompare(b.requestedAt) || a.id.localeCompare(b.id))
  const latestCancellationRefund = applicable.at(-1) ?? null
  let paymentKind: string | null = null
  let collectedMinor: string | null = null
  let excludedChargesMinor: string | null = null
  let eligible = true
  try {
    const payment = validateCancelablePayment(snapshot)
    paymentKind = payment.paymentKind
    collectedMinor = payment.collectedMinor
    excludedChargesMinor = payment.excludedChargesMinor
  } catch (error) {
    eligible = false
    issues.push(error instanceof CancellationError ? error.code : 'CANCELLATION_INVALID_SALE')
  }
  const cash = verifyCashRefundEvidence(refunds, proofs)
  issues.push(...cash.issues)
  const finished = refunds.filter(r => r.status === 'COMPLETED')
  const confirmedIds = new Set(finished.map(r => r.id))
  const auditedIds = new Set(settlements.map(r => r.refundId))
  let settlementOk = settlements.length === confirmedIds.size &&
    auditedIds.size === settlements.length &&
    settlements.every(r => confirmedIds.has(r.refundId) && r.accountingVerified)
  if (!settlementOk) issues.push('CANCELLATION_FULL_SETTLEMENT_AUDIT_FAILED')
  for (const record of settlements) issues.push(...record.issues.map(x => `${x}:${record.refundId}`))
  if (accounting) issues.push(...accounting.issues, ...accounting.stockIssues)
  let snapshotMatches = true
  if (accounting) {
    const confirmed = refunds.filter(r => r.status === 'COMPLETED').reduce((n, r) => n + minorUnits(r.amountMinor, 'refund'), 0n)
    const pending = refunds.filter(r => r.status === 'PENDING_EXTERNAL').reduce((n, r) => n + minorUnits(r.amountMinor, 'pending'), 0n)
    if (confirmed.toString() !== accounting.confirmedRefundMinor ||
      pending.toString() !== accounting.pendingRefundMinor) {
      issues.push('CANCELLATION_READ_SNAPSHOT_INCONSISTENT')
      snapshotMatches = false
    }
  }
  const auditOk = accounting !== null && accounting.verified && accounting.kardexVerified && cash.valid && settlementOk && snapshotMatches
  const stillPending = refunds.some(r => r.status === 'PENDING_EXTERNAL')
  const cancellationPending = applicable.some(r => r.status === 'PENDING_EXTERNAL')
  const allReturned = accounting !== null && accounting.lines.length > 0 &&
    accounting.lines.every(l => l.remainingQuantity === 0 && l.reservedQuantity === 0 &&
      l.returnedQuantity === l.soldQuantity)
  const moneyReturned = accounting !== null &&
    accounting.confirmedRefundMinor === accounting.originalMerchandiseMinor &&
    accounting.pendingRefundMinor === '0'
  let cancellationStatus: SaleCancellationView['cancellationStatus'] = 'ELIGIBLE'
  if (snapshot.historicalState !== 4) cancellationStatus = 'NOT_CONCLUDED'
  else if (!snapshot.merchandiseNetMinor || snapshot.payments.filter(x => x.direction === 'COLLECTION' && x.status === 'CONFIRMED').length !== 1)
    cancellationStatus = 'UNSUPPORTED_PAYMENT'
  else if (!eligible) cancellationStatus = issues.includes('CANCELLATION_CHARGES_REQUIRE_MANUAL_RECONCILIATION')
    ? 'CHARGES_REQUIRE_MANUAL_RECONCILIATION' : 'RECONCILIATION_REQUIRED'
  else if (!auditOk) cancellationStatus = 'RECONCILIATION_REQUIRED'
  else if (cancellationPending) cancellationStatus = 'PENDING_EXTERNAL'
  else if (stillPending) cancellationStatus = 'PENDING_OTHER_REFUND'
  else if (allReturned && moneyReturned) cancellationStatus = applicable.some(r => r.status === 'COMPLETED') ? 'FINANCIALLY_CANCELLED' : 'ALREADY_REFUNDED'
  else if (latestCancellationRefund?.status === 'CANCELLED') cancellationStatus = 'PENDING_WITHDRAWN'
  return {
    saleId: snapshot.saleId, saleReference: snapshot.saleReference, historicalState: snapshot.historicalState,
    cancellationStatus, commercialStatus: accounting?.commercialStatus ?? 'NOT_REFUNDED',
    canRequest: eligible && auditOk && !stillPending && !allReturned,
    paymentKind,
    originalMerchandiseMinor: snapshot.merchandiseNetMinor,
    originalCollectedMinor: collectedMinor,
    excludedChargesMinor,
    confirmedRefundMinor: accounting?.confirmedRefundMinor ?? null,
    pendingRefundMinor: accounting?.pendingRefundMinor ?? null,
    effectiveMerchandiseMinor: accounting?.effectiveMerchandiseMinor ?? null,
    verified: auditOk && eligible,
    kardexVerified: accounting?.kardexVerified ?? false,
    cashVerified: cash.valid,
    // No provider API consulted. An operator's external confirmation does NOT prove provider settlement.
    providerVerified: paymentKind === 'CASH' ? null : false,
    issues: [...new Set(issues)], latestCancellationRefund, lines: accounting?.lines ?? []
  }
}
