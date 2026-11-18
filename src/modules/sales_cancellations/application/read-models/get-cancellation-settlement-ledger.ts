import { QueryTypes } from 'sequelize'
import connect from '@shared/infrastructure/db/sequelize/sequelize.connect'
import { getTenantName } from '@shared/utils/tenant.utils'
import { verifyRefundSettlement, summarizeRefundSettlements, type RefundSettlementSource } from
  '@modules/sales_refunds/domain/refund-settlement-ledger'

/** Audits ONLY linked cancellation refunds, not all refunds or spoofable reason/key prefixes. */
export async function getCancellationSettlementLedger(storeId:string,startAt:Date,endAt:Date) {
  const tenant=getTenantName(storeId),db=connect()
  if(!/^tenant_[a-zA-Z0-9_-]+$/.test(tenant)||!storeId||startAt>=endAt)throw Error('CANCELLATION_LEDGER_INVALID_SCOPE')
  const table=(name:string)=>db.getDialect()==='sqlite'?`"${tenant}.${name}"`:`"${tenant}"."${name}"`
  const rows=await db.query<RefundSettlementSource>(`
    SELECT r."id" AS "refundId",r."saleId",r."saleReference",r."status",r."requestedAt",
      r."confirmedAt",r."amountMinor",r."paymentId",r."originalPaymentId",
      op."paymentKind" AS "originalPaymentKind",op."direction" AS "originalPaymentDirection",
      op."status" AS "originalPaymentStatus",op."idStore" AS "originalPaymentStoreId",
      p."direction" AS "paymentDirection",p."status" AS "paymentStatus",
      p."amountAppliedMinor" AS "paymentAmountMinor",p."settlementAmountMinor" AS "paymentSettlementMinor",
      p."roundingDeltaMinor" AS "paymentRoundingMinor",p."cashTenderedMinor",p."cashChangeMinor",
      p."originalPaymentId" AS "paymentOriginalId",p."saleId" AS "paymentSaleId",
      p."paymentKind",p."sessionId" AS "paymentSessionId",p."idStore" AS "paymentStoreId",
      m."id" AS "movementId",m."direction" AS "movementDirection",m."type" AS "movementType",
      m."amountMinor" AS "movementAmountMinor",m."sessionId" AS "movementSessionId",
      m."idStore" AS "movementStoreId"
    FROM ${table('sale_cancellation_operations')} co
    JOIN ${table('sale_refunds')} r ON r."id"=co."refundId" AND r."idStore"=co."idStore"
      AND r."saleId"=co."saleId" AND r."idempotencyKey"=co."refundKey"
    LEFT JOIN ${table('sale_payments')} p ON p."id"=r."paymentId" AND p."idStore"=r."idStore"
    LEFT JOIN ${table('sale_payments')} op ON op."id"=r."originalPaymentId" AND op."idStore"=r."idStore"
    LEFT JOIN ${table('cash_movements')} m ON m."paymentId"=p."id" AND m."idStore"=r."idStore"
    WHERE co."idStore"=:store AND co."kind"='PAID_REFUND' AND r."status"='COMPLETED'
      AND r."confirmedAt">=:start AND r."confirmedAt"<:end
    ORDER BY r."confirmedAt",r."id" LIMIT 10002`,
    {type:QueryTypes.SELECT,replacements:{store:storeId,start:startAt.toISOString(),end:endAt.toISOString()}})
  if(rows.length>10000)throw Error('CANCELLATION_LEDGER_LIMIT')
  const normalized=rows.map(r=>({...r,amountMinor:String(r.amountMinor),
    paymentAmountMinor:r.paymentAmountMinor==null?null:String(r.paymentAmountMinor),
    paymentSettlementMinor:r.paymentSettlementMinor==null?null:String(r.paymentSettlementMinor),
    paymentRoundingMinor:r.paymentRoundingMinor==null?null:String(r.paymentRoundingMinor),
    cashTenderedMinor:r.cashTenderedMinor==null?null:String(r.cashTenderedMinor),
    cashChangeMinor:r.cashChangeMinor==null?null:String(r.cashChangeMinor),
    movementAmountMinor:r.movementAmountMinor==null?null:String(r.movementAmountMinor),
    requestedAt:new Date(String(r.requestedAt)).toISOString(),
    confirmedAt:r.confirmedAt==null?null:new Date(String(r.confirmedAt)).toISOString()}))
  const verified=verifyRefundSettlement(normalized,storeId)
  return {summary:summarizeRefundSettlements(verified),rows:verified}
}
