/**
 * Pure helpers to compute a sale's `totalProductsPrice`.
 *
 * The total is the single source of truth persisted on the order header
 * (`orders_statuses.totalProductsPrice`) at sale time and later read back by
 * the sales metrics (`findTotalSales`, `countSalesAmountToday`). Keeping the
 * math here, free of Sequelize/GraphQL, makes it unit-testable and guarantees
 * the resolver and any backfill share the exact same definition:
 *
 *   total = base (priceProduct * cantProducts)
 *         + extras (sum of extraPrice * quantity for the selected complementos)
 *
 * Discounts, tips and delivery are intentionally excluded: they live in their
 * own columns and were never part of the historical `totalProductsPrice`.
 */

/** A sold extra contributing `extraPrice * quantity` to the line total. */
export interface OrderExtraLike {
  extraPrice?: number | string | null
  quantity?: number | string | null
  /** Original extra id used to decrement its own inventory. Preserved by the
   *  normalizer so the resolver can decrement/persist the exact same extra. */
  exPid?: string | null
  /** Catalog inventory flag. Not used by the money math (the stock decrement is
   *  what enforces availability), but kept so callers can pass the raw extra. */
  manageStock?: boolean | null
}

/** A sale line contributing base + its extras to the order total. */
export interface OrderLineLike {
  priceProduct?: number | string | null
  cantProducts?: number | string | null
  dataExtra?: OrderExtraLike[] | null
  /**
   * Courtesy flag. When true the whole line (product + extras) is a gift and
   * must contribute 0 to `totalProductsPrice`, so it is excluded from
   * accounting, reports, daily sales and the store's general sales regardless
   * of the real `priceProduct`/extra prices.
   */
  free?: boolean | null
}

/** Coerces a value to a finite number, falling back to 0 for null/NaN/∞. */
const toFiniteNumber = (value: unknown): number => {
  const n = Number(value ?? 0)
  return Number.isFinite(n) ? n : 0
}

/**
 * Sum of `extraPrice * quantity` for the extras whose quantity is >= 1.
 * Extras with missing/zero/negative quantity do not contribute (they were not
 * actually selected), matching the resolver's `selectedExtras` filter.
 */
export const computeExtrasTotal = (extras?: OrderExtraLike[] | null): number => {
  if (!Array.isArray(extras)) return 0
  return extras.reduce((acc, extra) => {
    const price = toFiniteNumber(extra?.extraPrice)
    const qty = toFiniteNumber(extra?.quantity)
    if (qty < 1) return acc
    return acc + price * qty
  }, 0)
}

/**
 * Normalizes the complementos that are effectively part of a sale line so the
 * SAME list (and the SAME per-extra quantity) drives the three places that
 * must agree: the money accrued into `totalProductsPrice`, the
 * `products_extras_sold` persistence and the inventory decrement.
 *
 * Rules (match the resolver, no parallel logic):
 * - Only extras with `quantity >= 1` are kept (unselected complementos arrive
 *   with quantity null/0 and must not be counted nor sold).
 * - The kept extra's quantity is normalized to a finite integer; when it is
 *   null/0 after the filter it falls back to the parent line quantity
 *   (`parentQty`), mirroring the historical POS behavior where an extra follows
 *   the product's quantity.
 *
 * NOTE: inventory availability (`manageStock` + stock) is NOT decided here. The
 * stock decrement is the single gate for that rule: an extra with
 * `manageStock = true` and no stock makes the whole sale fail (so it is never
 * counted), while an extra that does not manage stock is always sellable.
 *
 * @param extras - The raw selected extras of a line.
 * @param parentQty - The parent product quantity (fallback for missing qty).
 * @returns The sellable extras with a normalized, consistent `quantity`.
 */
export const normalizeSellableExtras = <T extends OrderExtraLike>(
  extras: T[] | null | undefined,
  parentQty: number
): Array<T & { quantity: number }> => {
  if (!Array.isArray(extras)) return []
  const safeParentQty = toFiniteNumber(parentQty)
  return extras
    .filter((extra) => toFiniteNumber(extra?.quantity) >= 1)
    .map((extra) => {
      const normalizedQty = toFiniteNumber(extra?.quantity) || safeParentQty
      return { ...extra, quantity: normalizedQty }
    })
}

/**
 * Base revenue of a line: `priceProduct * cantProducts` (never negative).
 * A courtesy line (`free === true`) always contributes 0, regardless of the
 * real price, so gifts never reach accounting/reports/daily/general sales.
 */
export const computeLineBaseTotal = (line: OrderLineLike): number => {
  if (line?.free === true) return 0
  const price = toFiniteNumber(line?.priceProduct)
  const qty = toFiniteNumber(line?.cantProducts)
  if (qty <= 0) return 0
  return price * qty
}

/**
 * Total for the whole order: sum over every line of base + extras.
 *
 * @param lines - The sale lines (each with its priceProduct/cantProducts and
 *   its selected extras).
 * @returns The order's `totalProductsPrice` (always a finite, non-negative
 *   number).
 */
export const computeOrderTotal = (lines?: OrderLineLike[] | null): number => {
  if (!Array.isArray(lines)) return 0
  const total = lines.reduce((acc, line) => {
    // Courtesy lines contribute nothing: neither the base nor the extras of a
    // free product are counted (the whole gift is excluded from the total).
    if (line?.free === true) return acc
    return acc + computeLineBaseTotal(line) + computeExtrasTotal(line?.dataExtra)
  }, 0)
  return Number.isFinite(total) && total > 0 ? total : 0
}

/** Discount type matching the POS / GraphQL `DiscountInput.type`. */
export type OrderDiscountType = 'PERCENT' | 'AMOUNT'

/** Structured, order-level discount as sent by the POS. */
export interface OrderDiscountLike {
  type?: OrderDiscountType | string | null
  /**
   * The user-entered figure: a percentage (0-100) when `type` is 'PERCENT' or a
   * money amount when `type` is 'AMOUNT'.
   */
  value?: number | string | null
}

/**
 * Compute the MONEY actually discounted for an order, given the structured
 * discount and the GROSS order total (base + extras, with free lines already
 * excluded — i.e. the output of {@link computeOrderTotal}).
 *
 * Rules (mirrors the POS frontend `applyDiscountToCart`):
 *  - PERCENT → `round(gross * value / 100)`, with `value` clamped to [0, 100].
 *  - AMOUNT  → `value` clamped to [0, gross] (a fixed discount never exceeds the
 *    discountable total).
 *  - Any invalid/missing input yields 0.
 *
 * The result is always a finite, non-negative number not greater than `gross`,
 * so it can never turn a sale negative.
 *
 * @param discount - The structured discount ({ type, value }).
 * @param grossTotal - The order's gross total (base + extras, free excluded).
 * @returns The money discounted (>= 0, <= grossTotal).
 */
export const computeDiscountAmount = (
  discount: OrderDiscountLike | null | undefined,
  grossTotal: number
): number => {
  const gross = toFiniteNumber(grossTotal)
  if (gross <= 0) return 0

  const type = String(discount?.type ?? 'PERCENT').toUpperCase()
  const rawValue = toFiniteNumber(discount?.value)
  if (rawValue <= 0) return 0

  if (type === 'AMOUNT') {
    // Fixed money discount, capped to the discountable total.
    return Math.min(rawValue, gross)
  }

  // Default/PERCENT: clamp the percentage to [0, 100] then apply.
  const percent = Math.min(100, Math.max(0, rawValue))
  const amount = Math.round((gross * percent) / 100)
  return Math.min(amount, gross)
}

/**
 * Net order total = gross total minus the money discounted, never negative.
 * This is the real income of the sale and is what every aggregated accounting
 * figure (day, general, reports, dashboard) must sum.
 *
 * @param grossTotal - The order's gross total (base + extras, free excluded).
 * @param discountAmount - The money discounted (output of {@link computeDiscountAmount}).
 * @returns The net total (>= 0).
 */
export const computeNetTotal = (grossTotal: number, discountAmount: number): number => {
  const gross = toFiniteNumber(grossTotal)
  const discount = toFiniteNumber(discountAmount)
  const net = gross - discount
  return net > 0 ? net : 0
}
