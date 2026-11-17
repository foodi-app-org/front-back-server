/** Exact financial cross-check for period totals; NO silent fallback to unverified money. */
export interface ConfirmedRefundEvidenceRow {
  refundId: string
  saleId: string
  originalPaymentId: string
  amountMinor: string | number
  paymentId: string | null
  evidenceId: string | null
  paymentSaleId: string | null
  paymentOriginalId: string | null
  paymentDirection: string | null
  paymentStatus: string | null
  paymentAmountMinor: string | number | null
}
function minor(v: string | number | null): bigint {
  if(v === null || !/^(0|[1-9]\d*)$/.test(String(v))) throw Error('REFUND_PERIOD_AMOUNT_INVALID')
  const amount=BigInt(String(v))
  if(amount > BigInt(Number.MAX_SAFE_INTEGER))throw Error('REFUND_PERIOD_AMOUNT_UNSAFE')
  return amount
}
export function sumVerifiedConfirmedRefunds(rows: readonly ConfirmedRefundEvidenceRow[]): bigint {
  const refunds=new Set<string>(), payments=new Set<string>()
  let total=0n
  for(const r of rows){
    if(!r.refundId || refunds.has(r.refundId) || !r.paymentId || payments.has(r.paymentId))
      throw Error('REFUND_PERIOD_DUPLICATE_OR_MISSING_ID')
    refunds.add(r.refundId);payments.add(r.paymentId)
    if(r.evidenceId!==r.paymentId || r.paymentSaleId!==r.saleId ||
      r.paymentOriginalId!==r.originalPaymentId || r.paymentDirection!=='REFUND' ||
      r.paymentStatus!=='CONFIRMED' || minor(r.paymentAmountMinor)!==minor(r.amountMinor))
      throw Error('REFUND_PERIOD_EVIDENCE_MISMATCH')
    total+=minor(r.amountMinor)
    if(total>BigInt(Number.MAX_SAFE_INTEGER))throw Error('REFUND_PERIOD_AMOUNT_UNSAFE')
  }
  return total
}
