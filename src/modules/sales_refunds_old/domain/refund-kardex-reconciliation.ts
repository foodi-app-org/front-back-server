import { extraDelta } from './refund-math'

export type SoldInventoryLine = {
  shoppingCartId: string
  productId: string
  soldQuantity: number
  extras: { extraId: string; soldQuantity: number }[]
}
export type RefundInventoryLine = {
  refundId: string
  itemId: string
  shoppingCartId: string
  quantity: number
  disposition: 'RESTOCK' | 'DAMAGED'
  status: 'COMPLETED' | 'CANCELLED' | 'PENDING_EXTERNAL'
  requestedAt: string
}
export type RefundKardexEntry = {
  id: string
  pId: string
  delta: number
  type: string
  meta: string | null
}
export type RefundStockExpectation = { refundItemId: string; kind: 'PRODUCT' | 'EXTRA'; catalogId: string; delta: number }

/** Cumulative floors keep extras conserved across partial refunds. Do not mutate ProductSold. */
export function expectedRestocksForSale(sold: readonly SoldInventoryLine[], items: readonly RefundInventoryLine[]): RefundStockExpectation[] {
  const catalog = new Map(sold.map(line => [line.shoppingCartId, line]))
  if (catalog.size !== sold.length) throw new Error('REFUND_STOCK_DUPLICATE_SOLD_LINE')
  const reserved = new Map<string, number>()
  const expected: RefundStockExpectation[] = []
  const completed = items.filter(item => item.status === 'COMPLETED')
    .sort((a,b) => a.requestedAt.localeCompare(b.requestedAt) || a.refundId.localeCompare(b.refundId) || a.itemId.localeCompare(b.itemId))
  for (const item of completed) {
    const line = catalog.get(item.shoppingCartId)
    if (!line) throw new Error('REFUND_STOCK_ORPHAN_LINE')
    if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) throw new Error('REFUND_STOCK_INVALID_QUANTITY')
    const previous = reserved.get(item.shoppingCartId) ?? 0
    if (previous + item.quantity > line.soldQuantity) throw new Error('REFUND_STOCK_OVER_REFUNDED')
    reserved.set(item.shoppingCartId, previous + item.quantity)
    if (item.disposition === 'DAMAGED') continue
    if (item.disposition !== 'RESTOCK') throw new Error('REFUND_STOCK_INVALID_DISPOSITION')
    expected.push({refundItemId:item.itemId,kind:'PRODUCT',catalogId:line.productId,delta:item.quantity})
    const sums = new Map<string,number>()
    for (const extra of line.extras) {
      const delta = extraDelta(extra.soldQuantity,line.soldQuantity,previous,item.quantity)
      sums.set(extra.extraId,(sums.get(extra.extraId)??0)+delta)
    }
    for (const [catalogId,delta] of sums) if (delta>0) expected.push({refundItemId:item.itemId,kind:'EXTRA',catalogId,delta})
  }
  return expected
}

export function reconcileRefundKardex(
  refundId: string,
  expectations: readonly RefundStockExpectation[],
  entries: readonly RefundKardexEntry[]
) {
  const expected = new Map<string,number>()
  const actual = new Map<string,number>()
  const issues: string[] = []
  const key = (item:string,kind:string,id:string) => `${item}|${kind}|${id}`
  for (const row of expectations) {
    const k=key(row.refundItemId,row.kind,row.catalogId)
    expected.set(k,(expected.get(k)??0)+row.delta)
  }
  const seen = new Set<string>()
  for (const entry of entries) {
    if (seen.has(entry.id)) {issues.push('REFUND_KARDEX_DUPLICATE_ENTRY_ID');continue}
    seen.add(entry.id)
    let meta: Record<string,unknown>
    try { meta=JSON.parse(entry.meta??'null') } catch {issues.push('REFUND_KARDEX_INVALID_META');continue}
    if (!meta || meta.reason!=='SALE_REFUND' || meta.refundId!==refundId) {issues.push('REFUND_KARDEX_FOREIGN_ENTRY');continue}
    const item=String(meta.refundItemId??''),kind=String(meta.kind??'')
    if (!['PRODUCT','EXTRA'].includes(kind) || !Number.isSafeInteger(entry.delta) || entry.delta<=0 || entry.type!=='RESTOCK') {
      issues.push('REFUND_KARDEX_INVALID_ENTRY');continue
    }
    const k=key(item,kind,entry.pId)
    actual.set(k,(actual.get(k)??0)+entry.delta)
  }
  for (const [k,quantity] of expected) if (actual.get(k)!==quantity) issues.push('REFUND_KARDEX_DELTA_MISMATCH')
  for (const k of actual.keys()) if (!expected.has(k)) issues.push('REFUND_KARDEX_UNEXPECTED_ENTRY')
  return {refundId,verified:issues.length===0,issues:[...new Set(issues)],expected:[...expected].map(([key,delta])=>({key,delta})),actual:[...actual].map(([key,delta])=>({key,delta}))}
}
