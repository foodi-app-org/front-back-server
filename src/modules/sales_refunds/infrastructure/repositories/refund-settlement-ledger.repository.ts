import type { Sequelize } from 'sequelize'
import { QueryTypes } from 'sequelize'
import { verifyRefundSettlement, summarizeRefundSettlements, type RefundSettlementSource } from '../../domain/refund-settlement-ledger'

/** Does not alter legacy sales reports: refunds are grouped by *confirmedAt*. */
export async function getRefundSettlementLedger(
  sequelize: Sequelize,
  tenant: string,
  storeId: string,
  startExclusiveInclusive: Date,
  endExclusive: Date
) {
  if (!/^tenant_[a-zA-Z0-9_-]+$/.test(tenant) || !storeId) throw new Error('REFUND_INVALID_TENANT')
  const table = (name: string) => sequelize.getDialect() === 'sqlite'
    ? `"${tenant}.${name}"` : `"${tenant}"."${name}"`
  const rows = await sequelize.query<RefundSettlementSource>(`
    SELECT r."id" AS "refundId", r."saleId",r."saleReference",r."status",
      r."requestedAt",r."confirmedAt",r."amountMinor",r."paymentId",r."originalPaymentId",
      op."paymentKind" AS "originalPaymentKind", op."direction" AS "originalPaymentDirection",
      op."status" AS "originalPaymentStatus", op."idStore" AS "originalPaymentStoreId",
      p."direction" AS "paymentDirection",p."status" AS "paymentStatus",
      p."amountAppliedMinor" AS "paymentAmountMinor",p."settlementAmountMinor" AS "paymentSettlementMinor",
      p."roundingDeltaMinor" AS "paymentRoundingMinor",p."cashTenderedMinor" AS "cashTenderedMinor",
      p."cashChangeMinor" AS "cashChangeMinor",p."originalPaymentId" AS "paymentOriginalId",
      p."saleId" AS "paymentSaleId",p."paymentKind",p."sessionId" AS "paymentSessionId",
      p."idStore" AS "paymentStoreId",m."id" AS "movementId",m."direction" AS "movementDirection",
      m."type" AS "movementType",m."amountMinor" AS "movementAmountMinor",
      m."sessionId" AS "movementSessionId",m."idStore" AS "movementStoreId"
    FROM ${table('sale_refunds')} r
    LEFT JOIN ${table('sale_payments')} p ON p."id"=r."paymentId" AND p."idStore"=r."idStore"
    LEFT JOIN ${table('sale_payments')} op ON op."id"=r."originalPaymentId" AND op."idStore"=r."idStore"
    LEFT JOIN ${table('cash_movements')} m ON m."paymentId"=p."id" AND m."idStore"=r."idStore"
    WHERE r."idStore"=:store AND r."status"='COMPLETED'
      AND r."confirmedAt">=:start AND r."confirmedAt"<:end
    ORDER BY r."confirmedAt",r."id"
    LIMIT 10002
  `, { type: QueryTypes.SELECT, replacements: {store:storeId,start:startExclusiveInclusive.toISOString(),end:endExclusive.toISOString()} })
  if (rows.length > 10000) throw new Error('REFUND_SETTLEMENT_REPORT_LIMIT')
  // The join may duplicate a refund with multiple cash movements; the audit detects this.
  const safe = rows.map(r => ({...r,amountMinor:String(r.amountMinor),
    paymentAmountMinor:r.paymentAmountMinor==null?null:String(r.paymentAmountMinor),
    paymentSettlementMinor:r.paymentSettlementMinor==null?null:String(r.paymentSettlementMinor),
    paymentRoundingMinor:r.paymentRoundingMinor==null?null:String(r.paymentRoundingMinor),
    cashTenderedMinor:r.cashTenderedMinor==null?null:String(r.cashTenderedMinor),
    cashChangeMinor:r.cashChangeMinor==null?null:String(r.cashChangeMinor),
    movementAmountMinor:r.movementAmountMinor==null?null:String(r.movementAmountMinor),
    requestedAt:new Date(r.requestedAt).toISOString(),
    confirmedAt:r.confirmedAt==null?null:new Date(r.confirmedAt).toISOString()}))
  const audited = verifyRefundSettlement(safe, storeId)
  return {summary:summarizeRefundSettlements(audited),rows:audited}
}
