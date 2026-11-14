import { formatMinor, minor, moneyNumber, type computePersistedSaleTotals } from 'exact-cart-totals'

type FinancialResult = ReturnType<typeof computePersistedSaleTotals>
type Header = Parameters<typeof computePersistedSaleTotals>[1] & { change?: unknown }
type Unit = 'MONEY' | 'PERCENT'
type Effect = 'ADD' | 'SUBTRACT' | 'INFO' | 'TOTAL'

const has = (value: unknown): boolean => value != null && value !== ''
const exact = (value: unknown): string => formatMinor(minor(value))
const optionalExact = (value: unknown): string | null => has(value) ? exact(value) : null
const numeric = (value: unknown): number => moneyNumber(minor(value))

export const mapLegacyTotals = (rows: FinancialResult['totals']) => rows.map(row => {
  const unit: Unit = row.key === 'globalDiscountPercent' ? 'PERCENT' : 'MONEY'
  return {
    ...row,
    value: String(row.value),
    unit,
    numericValue: row.value,
    exactValue: unit === 'PERCENT' ? String(row.value) : exact(row.value)
  }
})

function summaryRow(key: string, name: string, value: number, effect: Effect, unit: Unit = 'MONEY') {
  return { key, name, value, effect, unit, exactValue: unit === 'PERCENT' ? String(value) : exact(value) }
}

/** GraphQL presentation only. Never reprice or overwrite a persisted sale. */
export function mapSaleFinancials(financials: FinancialResult, header: Header) {
  const { calculated, source, valid, issues, gross, discountAmount, netTotal } = financials
  // The package's current settlement contract defaults absent additional charges to zero.
  // Raw header values remain nullable below so absence can be distinguished from zero.
  const delivery = numeric(header.valueDelivery ?? 0)
  const tip = numeric(header.tip ?? 0)
  const payableMinor = financials.settlement ? minor(financials.settlement.checkoutTotal) : minor(netTotal) + minor(delivery) + minor(tip)
  const payableTotal = moneyNumber(payableMinor)
  const change = has(header.change) ? numeric(header.change) : null
  const trustedBreakdown = valid && source === 'persisted' && calculated !== null
  const summary = [] as ReturnType<typeof summaryRow>[]
  if (trustedBreakdown && calculated) {
    summary.push(summaryRow('productGross', 'Productos', calculated.productGross, 'ADD'))
    summary.push(summaryRow('totalExtras', 'Complementos', calculated.totalExtras, 'ADD'))
    if (calculated.courtesyAmount != null && calculated.courtesyAmount > 0) {
      summary.push(summaryRow('courtesyAmount', 'Cortesías (ya excluidas)', calculated.courtesyAmount, 'INFO'))
    }
    if (calculated.totalVat > 0) summary.push(summaryRow('totalVat', 'Impuestos', calculated.totalVat, 'ADD'))
  }
  // Never publish an unverified per-line breakdown as recorded amounts.
  summary.push(summaryRow('gross', trustedBreakdown ? 'Subtotal cobrable' : 'Bruto de referencia', gross, 'TOTAL'))
  if (discountAmount > 0) {
    summary.push(summaryRow('discountAmount', 'Descuento comercial', discountAmount, 'SUBTRACT'))
    if (trustedBreakdown && calculated?.globalDiscountType === 'PERCENT') {
      summary.push(summaryRow('discountPercent', 'Descuento aplicado', calculated.globalDiscountPercent, 'INFO', 'PERCENT'))
    }
  }
  summary.push(summaryRow('netTotal', 'Neto de mercancía', netTotal, 'TOTAL'))
  if (delivery > 0) summary.push(summaryRow('delivery', 'Domicilio cobrado en POS', delivery, 'ADD'))
  // These are informational; they must not be added to the receipt twice.
  const settlement = financials.settlement
  if (settlement?.classification === 'CLASSIFIED') {
    if (minor(settlement.externalCharge!) > 0n) summary.push(summaryRow('externalDeliveryPayment', 'Domicilio a pagar al proveedor', numeric(settlement.externalCharge), 'INFO'))
    if (minor(settlement.thirdPartyPayable!) > 0n) summary.push(summaryRow('thirdPartyPayable', 'Importe de terceros (incluido en cobro)', numeric(settlement.thirdPartyPayable), 'INFO'))
  }
  if (tip > 0) summary.push(summaryRow('tip', 'Propina', tip, 'ADD'))
  summary.push(summaryRow('payableTotal', 'Total a pagar', payableTotal, 'TOTAL'))
  return {
    source, valid, issues, gross, discountAmount, netTotal, delivery, tip, payableTotal, change,
    currency: 'COP',
    settlement, deliveryVerified: financials.deliveryVerified, deliveryIssues: financials.deliveryIssues,
    exact: { gross: exact(gross), discountAmount: exact(discountAmount), netTotal: exact(netTotal), delivery: exact(delivery), tip: exact(tip), payableTotal: formatMinor(payableMinor), change: optionalExact(change) },
    persisted: {
      gross: optionalExact(header.totalProductsPrice), discountAmount: optionalExact(header.discountAmount),
      netTotal: optionalExact(header.netTotal), delivery: optionalExact(header.valueDelivery),
      tip: optionalExact(header.tip), change: optionalExact(header.change)
    },
    // A reconstruction is diagnostic, not a persisted per-line financial snapshot.
    calculated: calculated ? { ...calculated, totals: mapLegacyTotals(calculated.totals) } : null,
    breakdownVerified: trustedBreakdown,
    summary
  }
}
