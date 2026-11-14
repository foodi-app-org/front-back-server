import { computeCartTotals, computePersistedSaleTotals } from 'exact-cart-totals'
import { assertSameMoney, money, normalizeSaleDiscount, type Discount } from './sale-pricing-policy'

export type PricingRow = Parameters<typeof computeCartTotals>[0][number]

export function calculateSalePricing(rows: readonly PricingRow[], request: {
  discount?: unknown; valueDelivery?: unknown; tip?: unknown; change?: unknown; totalProductsPrice?: unknown
}) {
  const discount = normalizeSaleDiscount(request.discount)
  const delivery = money(request.valueDelivery ?? 0, 'valueDelivery')
  const tip = money(request.tip ?? 0, 'tip')
  const change = money(request.change ?? 0, 'change')
  const totals = computeCartTotals(rows, {
    pricingMode: 'pos', fractionPolicy: 'half-up', includeExtras: true,
    includeLines: true, globalDiscount: discount, delivery, tip, lang: 'es'
  })
  // The client's totalProductsPrice is the NET merchandise amount in useSales.
  // It is an optimistic checkout assertion, never a source of prices.
  if (request.totalProductsPrice == null) throw new Error('Missing checkout totalProductsPrice')
  assertSameMoney(totals.exact.netTotal, request.totalProductsPrice, 'checkout.netTotal')
  const header = {
    totalProductsPrice: money(totals.exact.subtotal, 'subtotal'),
    discountAmount: money(totals.exact.discountAmount, 'discountAmount'),
    netTotal: money(totals.exact.netTotal, 'netTotal'),
    valueDelivery: delivery, tip, change,
    discountType: discount?.type ?? null, discountValue: discount?.value ?? null
  }
  return { totals, header, discount }
}

/** Verify per-line persisted values as well as the aggregate reconciliation. */
export function assertSoldRows(expected: readonly PricingRow[], actual: readonly PricingRow[]): void {
  if (expected.length !== actual.length) throw new Error('Persisted line count mismatch')
  const byId = new Map(actual.map(row => [row.shoppingCartId, row]))
  if (byId.size !== actual.length) throw new Error('Duplicate persisted line')
  for (const line of expected) {
    const saved = byId.get(line.shoppingCartId)
    if (!saved) throw new Error(`Missing persisted line: ${line.shoppingCartId}`)
    assertSameMoney(line.priceProduct, saved.priceProduct, 'sold.priceProduct')
    assertSameMoney(line.products?.ProPrice, saved.products?.ProPrice, 'sold.ProPrice')
    if (Number(line.cantProducts) !== Number(saved.cantProducts)) throw new Error('Persisted product quantity mismatch')
    const free = (v: unknown) => v === true || v === 1 || v === '1' || v === 'true'
    if (free(line.free) !== free(saved.free) || free(line.products?.free) !== free(saved.products?.free)) throw new Error('Persisted courtesy mismatch')
    const wanted = line.products?.dataExtra ?? [], recorded = saved.products?.dataExtra ?? []
    const extraById = new Map(recorded.map(extra => [extra.exPid, extra]))
    if (wanted.length !== recorded.length || extraById.size !== recorded.length) throw new Error('Persisted extras count mismatch')
    for (const extra of wanted) {
      const match = extraById.get(extra.exPid)
      if (!match || Number(match.quantity) !== Number(extra.quantity)) throw new Error('Persisted extra quantity/identifier mismatch')
      assertSameMoney(extra.extraPrice, match.extraPrice, 'sold.extraPrice')
    }
  }
}

/** Abort before commit if written detail cannot reconcile with the header. */
export function verifySalePricing(rows: readonly PricingRow[], header: ReturnType<typeof calculateSalePricing>['header'], discount: Discount | null) {
  const verified = computePersistedSaleTotals(rows, { ...header, discount }, { lang: 'es', includeLines: true })
  if (!verified.valid) throw new Error(`Sale financial reconciliation failed: ${verified.issues.join(', ')}`)
  assertSameMoney(header.totalProductsPrice, verified.gross, 'persisted.gross')
  assertSameMoney(header.discountAmount, verified.discountAmount, 'persisted.discountAmount')
  assertSameMoney(header.netTotal, verified.netTotal, 'persisted.netTotal')
  return verified
}
