import { QueryTypes, type Sequelize } from 'sequelize'
import { sumVerifiedConfirmedRefunds, type ConfirmedRefundEvidenceRow } from '../../domain/verified-refund-amount'

/** A confirmed refund only reduces reported net when its payment evidence matches. */
export async function getVerifiedPeriodRefundMinor(
  db: Sequelize,
  table: (name: string) => string,
  range: { startAt: Date | string; endAt: Date | string; exclusiveEnd: boolean }
): Promise<bigint> {
  const compare = range.exclusiveEnd ? '<' : '<='
  const rows = await db.query<ConfirmedRefundEvidenceRow>(`
    SELECT r."id" AS "refundId", r."saleId", r."originalPaymentId", r."amountMinor",
      r."paymentId", p."id" AS "evidenceId", p."saleId" AS "paymentSaleId",
      p."originalPaymentId" AS "paymentOriginalId", p."direction" AS "paymentDirection",
      p."status" AS "paymentStatus", p."amountAppliedMinor" AS "paymentAmountMinor"
    FROM ${table('sale_refunds')} r
    LEFT JOIN ${table('sale_payments')} p ON p."id"=r."paymentId" AND p."idStore"=r."idStore"
    WHERE r."status"='COMPLETED' AND r."confirmedAt" >= :startAt
      AND r."confirmedAt" ${compare} :endAt
    ORDER BY r."id"
  `, {type:QueryTypes.SELECT,replacements:{startAt:range.startAt,endAt:range.endAt}})
  return sumVerifiedConfirmedRefunds(rows)
}
