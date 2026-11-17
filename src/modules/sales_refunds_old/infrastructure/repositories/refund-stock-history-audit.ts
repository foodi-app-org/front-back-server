import type { TransactionPort } from '../../../cash_management/domain/repositories/cash.repository'

/** Audit, not a mutation. Identify absent and duplicate RESTOCK ledger rows. */
export async function auditRefundStockHistory(tx: TransactionPort, refundId: string, storeId: string) {
  if (!refundId || !storeId) throw new Error('REFUND_AUDIT_INPUT_INVALID')
  type Item = { id: string; disposition: string }
  type Entry = { id: string; meta: string; delta: number | string; type: string }
  const items = await tx.query<Item>(`SELECT i."id", i."disposition"
    FROM ${tx.table('sale_refund_items')} i JOIN ${tx.table('sale_refunds')} r
      ON r."id"=i."refundId" AND r."idStore"=i."idStore"
    WHERE r."id"=:refundId AND r."idStore"=:store`, { refundId, store: storeId })
  const entries = await tx.query<Entry>(`SELECT "id","meta","delta","type" FROM ${tx.table('stock_history')}
    WHERE "type"='RESTOCK' AND "meta" LIKE :needle`,
  { needle: `%${refundId}%` })
  const registered = new Map<string, number>()
  const invalidEntryIds: string[] = []
  const allowedItems = new Set(items.filter(i=>i.disposition==='RESTOCK').map(i=>i.id))
  for (const entry of entries) {
    let metadata: Record<string,unknown>
    try { metadata = JSON.parse(entry.meta) } catch { invalidEntryIds.push(entry.id); continue }
    if (metadata.reason !== 'SALE_REFUND' || metadata.refundId !== refundId) continue
    const itemId = String(metadata.refundItemId ?? '')
    if (!allowedItems.has(itemId) || !['PRODUCT','EXTRA'].includes(String(metadata.kind)) ||
      !Number.isSafeInteger(Number(entry.delta)) || Number(entry.delta) <= 0) {
      invalidEntryIds.push(entry.id)
      continue
    }
    registered.set(itemId,(registered.get(itemId)??0)+1)
  }
  return { refundId, restockItemIds: [...allowedItems], historyRowCount: [...registered.values()].reduce((a,b)=>a+b,0),
    itemsWithoutHistory: [...allowedItems].filter(id=>!registered.has(id)), invalidEntryIds }
}
