import type { TransactionPort } from '../../domain/repositories/cash.repository'
import type { SalePayment } from '../../../payments/domain/entities/sale-payment.entity'

/** Only metadata lookup; external collections MUST NOT count toward this cash session's totals. */
export async function loadRefundOriginalPayments(
  tx: TransactionPort, storeId: string, payments: readonly SalePayment[]
): Promise<SalePayment[]> {
  const present = new Set(payments.map(p => p.id))
  const ids = [...new Set(payments.filter(p => p.direction === 'REFUND' && p.originalPaymentId &&
    !present.has(p.originalPaymentId)).map(p => p.originalPaymentId!))]
  if (!ids.length) return []
  // Bound input count mirrors the cash session's 30,000-payment limit.
  const rows = await tx.query<SalePayment>(`SELECT * FROM ${tx.table('sale_payments')}
    WHERE "idStore"=:store AND "id" IN (:ids) AND "direction"='COLLECTION' LIMIT 30001`,
  { store: storeId, ids })
  return rows
}
