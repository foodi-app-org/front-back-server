/** Validation at the write boundary. The actual commercial math belongs to exact-cart-totals. */
export type Discount = { type: 'PERCENT' | 'AMOUNT'; value: number }

/** No implicit rounding or locale coercion at the API/database boundary. */
export function cents(value: unknown, label: string): bigint {
  if (typeof value !== 'number' && typeof value !== 'string') throw new Error(`${label}: invalid money`)
  const raw = String(value).trim()
  if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) throw new Error(`${label}: expected a non-negative amount with at most two decimals`)
  const [whole, fraction = ''] = raw.split('.')
  const amount = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'))
  if (amount > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`${label}: amount exceeds supported range`)
  return amount
}

export function money(value: unknown, label: string): number {
  const minor = cents(value, label)
  const result = Number(minor) / 100
  if (cents(result, label) !== minor) throw new Error(`${label}: amount cannot be represented by the numeric DTO`)
  return result
}

export function normalizeSaleDiscount(raw: unknown): Discount | null {
  if (raw == null) return null
  if (typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid sale discount')
  const { type, value } = raw as { type?: unknown; value?: unknown }
  if (type !== 'PERCENT' && type !== 'AMOUNT') throw new Error('Invalid discount type')
  const amount = money(value, 'discount.value')
  if (type === 'PERCENT' && amount > 100) throw new Error('Discount percentage exceeds 100')
  return { type, value: amount }
}

export function positiveQuantity(value: unknown, label: string): number {
  if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') throw new Error(`${label}: invalid quantity`)
  const quantity = Number(value)
  if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new Error(`${label}: expected positive integer`)
  return quantity
}

export const monetaryFields = ['totalProductsPrice', 'discountAmount', 'netTotal', 'valueDelivery', 'tip', 'change'] as const
export type MonetaryHeader = Record<(typeof monetaryFields)[number], unknown>

export function assertSameMoney(expected: unknown, actual: unknown, label: string): void {
  if (cents(expected, label) !== cents(actual, label)) throw new Error(`${label}: monetary mismatch (expected ${expected}, received ${actual})`)
}

export function assertSaleHeader(expected: MonetaryHeader, actual: unknown): void {
  if (!actual || typeof actual !== 'object') throw new Error('Missing sale header')
  const row = actual as Record<string, unknown>
  for (const field of monetaryFields) assertSameMoney(expected[field], row[field], field)
}

export function assertDiscountHeader(expected: Discount | null, actual: unknown): void {
  if (!actual || typeof actual !== 'object') throw new Error('Missing discount header')
  const row = actual as Record<string, unknown>
  if ((row.discountType ?? null) !== (expected?.type ?? null)) throw new Error('discountType: mismatch')
  if (expected) assertSameMoney(expected.value, row.discountValue, 'discountValue')
  else if (row.discountValue != null) throw new Error('discountValue: expected null')
}
