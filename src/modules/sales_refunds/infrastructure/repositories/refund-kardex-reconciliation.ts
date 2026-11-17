import type { TransactionPort } from '../../../cash_management/domain/repositories/cash.repository'
import { expectedRestocksForSale, reconcileRefundKardex, type RefundInventoryLine, type SoldInventoryLine, type RefundKardexEntry } from '../../domain/refund-kardex-reconciliation'

type RefundHeader = { id: string; saleId: string; saleReference: string; status: RefundInventoryLine['status'] }
type ItemRow = { id: string; refundId: string; shoppingCartId: string; quantity: number | string; disposition: RefundInventoryLine['disposition']; status: RefundInventoryLine['status']; requestedAt: string }
type CartRow = { shoppingCartId: string; pId: string; cantProducts: number | string; originalProductId: string }
type ExtraRow = { pId: string; originalExPid: string; quantity: number | string }
const qty = (x: number|string) => {const n=Number(x);if(!Number.isSafeInteger(n)||n<0)throw Error('REFUND_STOCK_INVALID_QUANTITY');return n}

/** Read-only, tenant scoped quantity reconciliation. All queries reuse ONE TransactionPort. */
export async function auditRefundKardexQuantitative(tx:TransactionPort,refundId:string,storeId:string) {
  if (!refundId || !storeId) throw Error('REFUND_AUDIT_INPUT_INVALID')
  const header=(await tx.query<RefundHeader>(`SELECT "id","saleId","saleReference","status" FROM ${tx.table('sale_refunds')}
    WHERE "id"=:refundId AND "idStore"=:store LIMIT 1`,{refundId,store:storeId}))[0]
  if(!header)throw Error('REFUND_AUDIT_NOT_FOUND')
  const items=await tx.query<ItemRow>(`SELECT i."id",i."refundId",i."shoppingCartId",i."quantity",i."disposition",r."status",r."requestedAt"
    FROM ${tx.table('sale_refund_items')} i JOIN ${tx.table('sale_refunds')} r ON r."id"=i."refundId" AND r."idStore"=i."idStore"
    WHERE r."saleId"=:saleId AND r."idStore"=:store ORDER BY r."requestedAt",r."id",i."id"
    LIMIT 10001`,{saleId:header.saleId,store:storeId})
  if(items.length>10000)throw Error('REFUND_AUDIT_DETAIL_LIMIT')
  const carts=await tx.query<CartRow>(`SELECT c."shoppingCartId",c."pId",c."cantProducts",p."optionalProductId" AS "originalProductId"
    FROM ${tx.table('shopping_carts')} c
    JOIN ${tx.table('product_models_sold')} p ON p."pId"=c."pId" AND p."idStore"=c."idStore"
    JOIN ${tx.table('orders_statuses')} o ON o."shoppingCartRefCode"=c."shoppingCartRefCode" AND o."idStore"=c."idStore"
    WHERE o."stPId"=:saleId AND o."idStore"=:store AND p."pCodeRef"=o."pCodeRef" LIMIT 1001`,
    {saleId:header.saleId,store:storeId})
  if(carts.length>1000)throw Error('REFUND_AUDIT_DETAIL_LIMIT')
  const soldIds=carts.map(c=>c.pId)
  const extras=soldIds.length?await tx.query<ExtraRow>(`SELECT "pId","originalExPid","quantity" FROM ${tx.table('products_extras_sold')}
    WHERE "pId" IN (:ids) AND "pCodeRef"=:reference AND "idStore"=:store LIMIT 10001`,
    {ids:soldIds,reference:header.saleReference,store:storeId}):[]
  if(extras.length>10000)throw Error('REFUND_AUDIT_DETAIL_LIMIT')
  const sold:SoldInventoryLine[]=carts.map(c=>({shoppingCartId:c.shoppingCartId,productId:c.originalProductId,
    soldQuantity:qty(c.cantProducts),extras:extras.filter(e=>e.pId===c.pId).map(e=>({extraId:e.originalExPid,soldQuantity:qty(e.quantity)}))}))
  const expectations=expectedRestocksForSale(sold,items.map(i=>({refundId:i.refundId,itemId:i.id,shoppingCartId:i.shoppingCartId,
    quantity:qty(i.quantity),disposition:i.disposition,status:i.status,requestedAt:String(i.requestedAt)})))
    .filter(e=>items.some(i=>i.refundId===refundId && i.id===e.refundItemId))
  const entries=await tx.query<RefundKardexEntry>(`SELECT "id","pId","delta","type","meta" FROM ${tx.table('stock_history')}
    WHERE "type"='RESTOCK' AND "meta" LIKE :needle LIMIT 10001`,{needle:`%${refundId}%`})
  if(entries.length>10000)throw Error('REFUND_AUDIT_DETAIL_LIMIT')
  return reconcileRefundKardex(refundId,expectations,entries.map(e=>({...e,delta:qty(e.delta)})))
}
