import { QueryTypes, type Sequelize } from 'sequelize'
import { getRefundSettlementLedger } from '@modules/sales_refunds/infrastructure/repositories/refund-settlement-ledger.repository'

import {decimalToMinor, amountToCop, dateAtUtc, localDateOf} from '../../domain/financial-money'
export { decimalToMinor, amountToCop, dateAtUtc, localDateOf } from '../../domain/financial-money'

interface SaleRow {
  saleId:string; saleReference:string; createdAt:string; netTotal:string|number|null
  gross:string|number|null; paymentMethod:string|null
}
export interface FinancialActivity {
  saleCount:number
  originalMerchandiseMinor:string
  refundsConfirmedMinor:string
  netMerchandiseMinor:string
  byDay:Array<{day:string;sales:number;originalMinor:string;refundedMinor:string;netMinor:string}>
  byPaymentMethod:Array<{paymentMethod:string;sales:number;originalMinor:string;refundedMinor:string;netMinor:string}>
  /** Explicit warning: provider verification is separate from internal accounting verification. */
  providerUnverifiedRefunds:number
}
interface Bucket {sales:number;original:bigint;refunded:bigint}
const empty=():Bucket=>({sales:0,original:0n,refunded:0n})
const accumulate=(m:Map<string,Bucket>,k:string,sale:bigint,refund:bigint,isSale:boolean=false) => {
  const b=m.get(k)??empty();b.original+=sale;b.refunded+=refund;b.sales+=isSale?1:0;m.set(k,b)
}
const output=(m:Map<string,Bucket>,field:'day'|'paymentMethod')=>[...m].sort((a,b)=>a[0].localeCompare(b[0]))
  .map(([key,b])=>({[field]:key,sales:b.sales,originalMinor:b.original.toString(),
    refundedMinor:b.refunded.toString(),netMinor:(b.original-b.refunded).toString()}))
/**
 * Authoritative, FAIL-CLOSED period view. Refunds belong to their confirmation date,
 * including refunds of sales from earlier periods. No SQL SUM over decimal money.
 * Historical products sold remain historical, NOT net stock delivered.
 */
export async function financialPeriodActivity(input:{
  db:Sequelize;tenant:string;storeId:string;startAt:string;endAt:string;timezone:string
}):Promise<FinancialActivity> {
  const {db,tenant,storeId,timezone}=input
  if(!/^tenant_[a-zA-Z0-9_-]+$/.test(tenant)||!storeId)throw Error('REPORT_INVALID_TENANT')
  const table=(name:string)=>db.getDialect()==='sqlite'?`"${tenant}.${name}"`:`"${tenant}"."${name}"`
  const start=dateAtUtc(input.startAt),end=dateAtUtc(input.endAt)
  if(start>=end)throw Error('REPORT_INVALID_RANGE')
  const sales=await db.query<SaleRow>(`
    SELECT o."stPId" AS "saleId",o."pCodeRef" AS "saleReference",o."createdAt" AS "createdAt",
           o."netTotal",o."totalProductsPrice" AS "gross",COALESCE(pm."name",'Sin registrar') AS "paymentMethod"
    FROM ${table('orders_statuses')} o
    JOIN ${table('order_status_types')} st ON st."idStatus"=o."idStatus"
    LEFT JOIN ${table('payment_methods')} pm ON pm."payId"=o."payId"
    WHERE o."idStore"=:store AND st."state"=4
      AND o."createdAt">=:startAt AND o."createdAt"<:endAt
    ORDER BY o."createdAt",o."stPId" LIMIT 50001`,
    {type:QueryTypes.SELECT,replacements:{store:storeId,startAt:input.startAt,endAt:input.endAt}})
  if(sales.length>50000)throw Error('REPORT_SALES_LIMIT')
  const refund=await getRefundSettlementLedger(db,tenant,storeId,start,end)
  if(refund.rows.some(row=>!row.accountingVerified))throw Error('REPORT_UNVERIFIED_REFUND_EVIDENCE')
  let original=0n,refunded=0n
  const byDay=new Map<string,Bucket>(),byMethod=new Map<string,Bucket>()
  for(const sale of sales){
    const amount=decimalToMinor(sale.netTotal??sale.gross)
    original+=amount
    accumulate(byDay,localDateOf(sale.createdAt,timezone),amount,0n,true)
    accumulate(byMethod,sale.paymentMethod??'Sin registrar',amount,0n,true)
  }
  // Match refund to its ORIGINAL method, not the method used to execute an administrative transfer.
  const ids=refund.rows.map(r=>r.refundId)
  const methodRows=ids.length?await db.query<{refundId:string;methodName:string|null}>(`
    SELECT r."id" AS "refundId",COALESCE(pm."name",'Sin registrar') AS "methodName"
    FROM ${table('sale_refunds')} r
    JOIN ${table('sale_payments')} op ON op."id"=r."originalPaymentId" AND op."idStore"=r."idStore"
    LEFT JOIN ${table('payment_methods')} pm ON pm."payId"=op."payId"
    WHERE r."idStore"=:store AND r."id" IN (:ids)`,
    {type:QueryTypes.SELECT,replacements:{store:storeId,ids}}):[]
  const methodLookup=new Map(methodRows.map(row=>[row.refundId,row.methodName??'Sin registrar']))
  if(methodLookup.size!==ids.length)throw Error('REPORT_REFUND_PAYMENT_LOOKUP_INCOMPLETE')
  for(const row of refund.rows){
    if(!row.confirmedAt)throw Error('REPORT_REFUND_CONFIRMATION_MISSING')
    const amount=BigInt(row.amountMinor)
    refunded+=amount
    accumulate(byDay,localDateOf(row.confirmedAt,timezone),0n,amount)
    accumulate(byMethod,methodLookup.get(row.refundId)!,0n,amount)
  }
  if(original>BigInt(Number.MAX_SAFE_INTEGER)||refunded>BigInt(Number.MAX_SAFE_INTEGER))throw Error('REPORT_AMOUNT_UNSAFE')
  return {saleCount:sales.length,originalMerchandiseMinor:original.toString(),
    refundsConfirmedMinor:refunded.toString(),netMerchandiseMinor:(original-refunded).toString(),
    byDay:output(byDay,'day') as FinancialActivity['byDay'],
    byPaymentMethod:output(byMethod,'paymentMethod') as FinancialActivity['byPaymentMethod'],
    providerUnverifiedRefunds:refund.rows.filter(row=>row.providerVerified===false).length}
}
