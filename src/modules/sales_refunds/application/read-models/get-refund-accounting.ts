import type { CashRepository, TransactionPort } from '../../../cash_management/domain/repositories/cash.repository'
import { decimalMinor } from '../../../cash_management/domain/services/cash-money'
import { reconcileRefundFinancials, type RefundLedgerRow, type RefundPaymentEvidence } from '../../domain/reconcile-refund-financials'
import { expectedRestocksForSale, type RefundInventoryLine, type SoldInventoryLine } from '../../domain/refund-kardex-reconciliation'
import { auditRefundKardexQuantitative } from '../../infrastructure/repositories/refund-kardex-reconciliation'
import { classifyRefundOrder, projectRefundOrderLines } from '../../domain/order-refund-projection'

type Header = { stPId:string; pCodeRef:string; netTotal:string | null; totalProductsPrice:string | null; shoppingCartRefCode:string }
type Sold = { shoppingCartId:string; soldProductId:string; catalogProductId:string; productName:string; soldQuantity:number|string }
type SoldExtra = { soldProductId:string; catalogExtraId:string; extraName:string; quantity:number|string }
type RefundItem = RefundInventoryLine & { amountMinor:string }
const units = (n:unknown):number => { const x=Number(n);if(!Number.isSafeInteger(x)||x<0)throw Error('REFUND_INVALID_SOLD_QUANTITY');return x }

/** Complete sale-date accounting statement, read-only and scoped to original immutable snapshots. */
export class GetRefundAccounting {
  constructor(private readonly repo: CashRepository) {}
  execute(saleReference:string) {
    if(!saleReference || saleReference.length>100)throw Error('REFUND_INVALID_REFERENCE')
    const read = async(tx:TransactionPort) => {
      const sale=(await tx.query<Header>(`SELECT "stPId","pCodeRef","netTotal","totalProductsPrice","shoppingCartRefCode"
        FROM ${tx.table('orders_statuses')} WHERE "idStore"=:store AND "pCodeRef"=:ref LIMIT 1`,
        {store:this.repo.idStore,ref:saleReference}))[0]
      if(!sale||sale.netTotal==null)throw Error('REFUND_SALE_NOT_FOUND_OR_UNRECONCILED')
      const refunds=(await tx.query<RefundLedgerRow>(`SELECT "id","saleId","status","amountMinor","confirmedAt","paymentId"
        FROM ${tx.table('sale_refunds')} WHERE "idStore"=:store AND "saleId"=:saleId ORDER BY "requestedAt","id" LIMIT 10001`,
        {store:this.repo.idStore,saleId:sale.stPId})).map(r=>({...r,amountMinor:String(r.amountMinor),confirmedAt:r.confirmedAt==null?null:String(r.confirmedAt)}))
      if(refunds.length>10000)throw Error('REFUND_DETAIL_LIMIT')
      const payments=(await tx.query<RefundPaymentEvidence>(`SELECT "id","saleId","direction","status","amountAppliedMinor"
        FROM ${tx.table('sale_payments')} WHERE "idStore"=:store AND "saleId"=:saleId LIMIT 10001`,
        {store:this.repo.idStore,saleId:sale.stPId})).map(p=>({...p,amountAppliedMinor:String(p.amountAppliedMinor)}))
      if(payments.length>10000)throw Error('REFUND_DETAIL_LIMIT')
      const financial = reconcileRefundFinancials(sale.stPId,decimalMinor(String(sale.netTotal)).toString(),refunds,payments)
      const sold=await tx.query<Sold>(`SELECT c."shoppingCartId",c."pId" AS "soldProductId",
        p."optionalProductId" AS "catalogProductId", p."pName" AS "productName",c."cantProducts" AS "soldQuantity"
        FROM ${tx.table('shopping_carts')} c JOIN ${tx.table('product_models_sold')} p
          ON p."pId"=c."pId" AND p."idStore"=c."idStore"
        WHERE c."idStore"=:store AND c."shoppingCartRefCode"=:cartRef AND p."pCodeRef"=:ref LIMIT 1001`,
        {store:this.repo.idStore,cartRef:sale.shoppingCartRefCode,ref:sale.pCodeRef})
      if(sold.length>1000)throw Error('REFUND_DETAIL_LIMIT')
      const soldPids=sold.map(s=>s.soldProductId)
      const extras=soldPids.length?await tx.query<SoldExtra>(`SELECT "pId" AS "soldProductId", "originalExPid" AS "catalogExtraId", "extraName", "quantity"
        FROM ${tx.table('products_extras_sold')} WHERE "pId" IN (:ids) AND "idStore"=:store AND "pCodeRef"=:ref LIMIT 10001`,
        {ids:soldPids,store:this.repo.idStore,ref:sale.pCodeRef}):[]
      const inventory:SoldInventoryLine[]=sold.map(s=>({shoppingCartId:s.shoppingCartId,productId:s.catalogProductId,
        soldQuantity:units(s.soldQuantity),extras:extras.filter(e=>e.soldProductId===s.soldProductId)
          .map(e=>({extraId:e.catalogExtraId,soldQuantity:units(e.quantity)}))}))
      const returned=await tx.query<RefundItem>(`SELECT i."id" AS "itemId",i."refundId",i."shoppingCartId",i."quantity",i."disposition",i."amountMinor",
        r."status",r."requestedAt" FROM ${tx.table('sale_refund_items')} i JOIN ${tx.table('sale_refunds')} r
        ON r."id"=i."refundId" AND r."idStore"=i."idStore"
        WHERE r."saleId"=:saleId AND r."idStore"=:store ORDER BY r."requestedAt",r."id",i."id" LIMIT 10001`,
        {saleId:sale.stPId,store:this.repo.idStore})
      if(returned.length>10000)throw Error('REFUND_DETAIL_LIMIT')
      const items=returned.map(r=>({...r,quantity:units(r.quantity),requestedAt:String(r.requestedAt)}))
      const stockIssues:string[]=[]
      try {expectedRestocksForSale(inventory,items)} catch(e){stockIssues.push(e instanceof Error?e.message:'REFUND_STOCK_UNVERIFIED')}
      const completedRefunds=refunds.filter(r=>r.status==='COMPLETED')
      if(completedRefunds.length>50)throw Error('REFUND_AUDIT_COUNT_LIMIT')
      const audits=[]
      for (const refund of completedRefunds) {
        const audit=await auditRefundKardexQuantitative(tx,refund.id,this.repo.idStore)
        // @ts-ignore
        audits.push(audit)
        if(!audit.verified)stockIssues.push('REFUND_KARDEX_MISMATCH:'+refund.id)
      }
      const baseLines=sold.map(s=>{
        const q=units(s.soldQuantity)
        const affected=items.filter(i=>i.shoppingCartId===s.shoppingCartId&&i.status!=='CANCELLED')
        const confirmed=affected.filter(i=>i.status==='COMPLETED').reduce((n,i)=>n+i.quantity,0)
        const pending=affected.filter(i=>i.status==='PENDING_EXTERNAL').reduce((n,i)=>n+i.quantity,0)
        const remaining=q-confirmed-pending
        if(remaining<0)stockIssues.push('REFUND_OVER_REFUNDED')
        return {shoppingCartId:s.shoppingCartId,soldProductId:s.soldProductId,catalogProductId:s.catalogProductId,
          productName:s.productName,soldQuantity:q,returnedQuantity:confirmed,reservedQuantity:pending,
          remainingQuantity:Math.max(remaining,0)}
      })
      const productIds=[...new Set(sold.map(s=>s.catalogProductId))]
      const extraIds=[...new Set(extras.map(e=>e.catalogExtraId))]
      type CatalogRow = { pId?:string; exPid?:string; stock:number|string|null; manageStock:unknown }
      const productCatalog=productIds.length?await tx.query<CatalogRow>(`SELECT "pId","stock","manageStock"
        FROM ${tx.table('product_models')} WHERE "idStore"=:store AND "pId" IN (:ids)`,
        {store:this.repo.idStore,ids:productIds}):[]
      const extrasCatalog=extraIds.length?await tx.query<CatalogRow>(`SELECT "exPid","stock","manageStock"
        FROM ${tx.table('products_extras')} WHERE "idStore"=:store AND "exPid" IN (:ids)`,
        {store:this.repo.idStore,ids:extraIds}):[]
      const state=(x:unknown):boolean|null => x===true||x===1||x==='1'?true:x===false||x===0||x==='0'?false:null
      const stock=(x:unknown):number|null => {
        if(x===null||x===undefined)return null
        const n=Number(x)
        if(!Number.isSafeInteger(n)||n<0)throw Error('REFUND_CURRENT_STOCK_INVALID')
        return n
      }
      const lines=projectRefundOrderLines({
        lines:baseLines,
        extras:extras.map(e=>({soldProductId:e.soldProductId,catalogExtraId:e.catalogExtraId,
          extraName:e.extraName,quantity:units(e.quantity)})),
        items:items.map(i=>({itemId:i.itemId,shoppingCartId:i.shoppingCartId,quantity:i.quantity,
          status:i.status,disposition:i.disposition})),
        audits,
        productStocks:productCatalog.map(p=>({id:String(p.pId),stock:stock(p.stock),manageStock:state(p.manageStock)})),
        extraStocks:extrasCatalog.map(p=>({id:String(p.exPid),stock:stock(p.stock),manageStock:state(p.manageStock)}))
      })
      const kardexVerified=stockIssues.length===0&&lines.every(line=>line.restockVerified&&line.extras.every(x=>x.restockVerified))
      const commercialStatus=classifyRefundOrder({originalMerchandiseMinor:financial.originalMerchandiseMinor,
        confirmedRefundMinor:financial.confirmedRefundMinor,pendingRefundMinor:financial.pendingRefundMinor,
        verified:financial.verified,kardexVerified,lines})
        // @ts-ignore
      return {saleId:sale.stPId,saleReference:sale.pCodeRef,originalGrossMinor:sale.totalProductsPrice==null?null:decimalMinor(String(sale.totalProductsPrice)).toString(),
        ...financial,commercialStatus,lines,stockIssues,kardexVerified,kardexAudits:audits}
    }
    return this.repo.read?this.repo.read(read):this.repo.transaction(read)
  }
}
