/** Read-side projection only. Neither orders_statuses nor ProductSold may be mutated here. */
export type RefundCommercialStatus =
  | 'NOT_REFUNDED'
  | 'REFUND_PENDING'
  | 'PARTIALLY_REFUNDED'
  | 'FULLY_REFUNDED'
  | 'REVIEW_REQUIRED'

export type AuditAmounts = { key: string; delta: number }
export type RefundKardexEvidence = {
  refundId: string
  verified: boolean
  issues: string[]
  expected: readonly AuditAmounts[]
  actual: readonly AuditAmounts[]
}
export type RefundInventoryItem = {
  itemId: string
  shoppingCartId: string
  quantity: number
  status: 'COMPLETED' | 'PENDING_EXTERNAL' | 'CANCELLED'
  disposition: 'RESTOCK' | 'DAMAGED' | 'NO_STOCK'
}
export type RefundSoldLine = {
  shoppingCartId: string
  soldProductId: string
  catalogProductId: string
  productName: string
  soldQuantity: number
  returnedQuantity: number
  reservedQuantity: number
  remainingQuantity: number
}
export type RefundSoldExtra = {
  soldProductId: string
  catalogExtraId: string
  extraName: string
  quantity: number
}
export type CatalogStock = { id: string; stock: number | null; manageStock: boolean | null }

export type RefundStockDetail = {
  catalogId: string
  name: string
  soldQuantity: number
  expectedRestockedQuantity: number
  restockedQuantity: number
  wasRestocked: boolean
  restockVerified: boolean
  currentStock: number | null
  manageStock: boolean | null
}
export type RefundOrderLine = RefundSoldLine & {
  expectedRestockedQuantity: number
  restockedQuantity: number
  wasRestocked: boolean
  restockVerified: boolean
  currentStock: number | null
  manageStock: boolean | null
  extras: RefundStockDetail[]
}

function safeCount(value: unknown, label: string): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`REFUND_${label}_INVALID`)
  return n
}
function auditIndex(
  audits: readonly RefundKardexEvidence[],
  itemToLine: ReadonlyMap<string, string>,
  column: 'expected' | 'actual'
): Map<string, number> {
  const sums = new Map<string, number>()
  for (const audit of audits) {
    for (const record of audit[column]) {
      const [itemId, kind, catalogId, ...more] = record.key.split('|')
      const lineId = itemToLine.get(itemId)
      if (!lineId || more.length || !['PRODUCT', 'EXTRA'].includes(kind) || !catalogId) {
        throw new Error('REFUND_KARDEX_INVALID_REFERENCE')
      }
      const key = `${lineId}|${kind}|${catalogId}`
      const value = (sums.get(key) ?? 0) + safeCount(record.delta, 'KARDEX_DELTA')
      if (!Number.isSafeInteger(value)) throw new Error('REFUND_KARDEX_OVERFLOW')
      sums.set(key, value)
    }
  }
  return sums
}

/**
 * Stock-history actuals are attributed by refundItemId -> shoppingCartId, never
 * by the snapshot pId alone.  Catalog snapshots and inventory are independent.
 * 'wasRestocked' states only that a RESTOCK movement was logged; it does not
 * prove a current on-hand quantity or the physical condition of returned goods.
 */
export function projectRefundOrderLines(input: {
  lines: readonly RefundSoldLine[]
  extras: readonly RefundSoldExtra[]
  items: readonly RefundInventoryItem[]
  audits: readonly RefundKardexEvidence[]
  productStocks?: readonly CatalogStock[]
  extraStocks?: readonly CatalogStock[]
}): RefundOrderLine[] {
  const itemToLine = new Map<string, string>()
  for (const item of input.items) {
    if (!item.itemId || itemToLine.has(item.itemId)) throw new Error('REFUND_ITEM_DUPLICATE')
    itemToLine.set(item.itemId, item.shoppingCartId)
  }
  const expected = auditIndex(input.audits, itemToLine, 'expected')
  const actual = auditIndex(input.audits, itemToLine, 'actual')
  const products = new Map((input.productStocks ?? []).map(p => [p.id, p]))
  const extrasStock = new Map((input.extraStocks ?? []).map(p => [p.id, p]))
  const validLines = new Set(input.lines.map(l => l.shoppingCartId))
  if (validLines.size !== input.lines.length) throw new Error('REFUND_SOLD_LINE_DUPLICATE')
  for (const item of input.items) if (!validLines.has(item.shoppingCartId)) throw new Error('REFUND_ITEM_ORPHAN')

  const used = new Set<string>()
  const out = input.lines.map(line => {
    const key = `${line.shoppingCartId}|PRODUCT|${line.catalogProductId}`
    used.add(key)
    const e = expected.get(key) ?? 0, a = actual.get(key) ?? 0
    const p = products.get(line.catalogProductId)
    const soldExtras = new Map<string, { name: string; quantity: number }>()
    for (const extra of input.extras.filter(x => x.soldProductId === line.soldProductId)) {
      const previous = soldExtras.get(extra.catalogExtraId)
      soldExtras.set(extra.catalogExtraId, {
        name: extra.extraName,
        quantity: (previous?.quantity ?? 0) + safeCount(extra.quantity, 'EXTRA_QTY')
      })
    }
    const extraDetails = [...soldExtras].map(([catalogId, x]) => {
      const extraKey = `${line.shoppingCartId}|EXTRA|${catalogId}`
      used.add(extraKey)
      const extraExpected = expected.get(extraKey) ?? 0
      const extraActual = actual.get(extraKey) ?? 0
      const stock = extrasStock.get(catalogId)
      return {
        catalogId, name: x.name, soldQuantity: x.quantity,
        expectedRestockedQuantity: extraExpected,
        restockedQuantity: extraActual,
        wasRestocked: extraActual > 0,
        restockVerified: extraExpected === extraActual,
        currentStock: stock?.stock ?? null,
        manageStock: stock?.manageStock ?? null
      }
    })
    return {
      ...line,
      expectedRestockedQuantity: e,
      restockedQuantity: a,
      wasRestocked: a > 0,
      restockVerified: e === a,
      currentStock: p?.stock ?? null,
      manageStock: p?.manageStock ?? null,
      extras: extraDetails
    }
  })
  for (const key of [...expected.keys(), ...actual.keys()]) {
    if (!used.has(key)) throw new Error('REFUND_KARDEX_ORPHAN_CATALOG_REFERENCE')
  }
  return out
}

export function classifyRefundOrder(input: {
  originalMerchandiseMinor: string
  confirmedRefundMinor: string
  pendingRefundMinor: string
  lines: readonly Pick<RefundSoldLine, 'soldQuantity' | 'returnedQuantity' | 'reservedQuantity'>[]
  verified: boolean
  kardexVerified: boolean
}): RefundCommercialStatus {
  if (!input.verified || !input.kardexVerified) return 'REVIEW_REQUIRED'
  const original = BigInt(input.originalMerchandiseMinor)
  const confirmed = BigInt(input.confirmedRefundMinor)
  const pending = BigInt(input.pendingRefundMinor)
  if (original < 0n || confirmed < 0n || pending < 0n || confirmed + pending > original) {
    return 'REVIEW_REQUIRED'
  }
  const sold = input.lines.reduce((n, l) => n + safeCount(l.soldQuantity, 'SOLD_QTY'), 0)
  const returned = input.lines.reduce((n, l) => n + safeCount(l.returnedQuantity, 'RETURNED_QTY'), 0)
  const reserved = input.lines.reduce((n, l) => n + safeCount(l.reservedQuantity, 'RESERVED_QTY'), 0)
  if (returned + reserved > sold) return 'REVIEW_REQUIRED'
  if (pending > 0n || reserved > 0) return 'REFUND_PENDING'
  if (returned === 0 && confirmed === 0n) return 'NOT_REFUNDED'
  if (returned === sold && confirmed === original) return 'FULLY_REFUNDED'
  return 'PARTIALLY_REFUNDED'
}
