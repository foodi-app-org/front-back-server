import { calculateDeliveryDistribution, computeSaleSettlement, deliveryTermsFromMinor } from 'exact-cart-totals'
import { DELIVERY_MODES, type DeliveryMethod, type DeliveryMode, type DeliveryParty, type DeliveryProvider } from '../entities/delivery-method.entity'
import type { DeliveryQuoteInput, DeliveryStatus, DeliveryTerms } from '../entities/sale-delivery.entity'
import { DeliveryError, invalid } from './delivery-error'
import { decimalToMinor, readMinor, displayMinor } from './delivery-money'

export const POLICY_VERSION = 1 as const
interface Policy { providerType: DeliveryProvider; collector: DeliveryParty; beneficiary: DeliveryParty; free: boolean; merchantPaysCost: boolean }
export const DELIVERY_POLICIES: Readonly<Record<DeliveryMode, Readonly<Policy>>> = {
  NONE: { providerType: 'NONE', collector: 'NONE', beneficiary: 'NONE', free: true, merchantPaysCost: false },
  MERCHANT: { providerType: 'OWN', collector: 'MERCHANT', beneficiary: 'MERCHANT', free: false, merchantPaysCost: true },
  MERCHANT_EXTERNAL: { providerType: 'THIRD_PARTY', collector: 'MERCHANT', beneficiary: 'MERCHANT', free: false, merchantPaysCost: true },
  THIRD_PARTY_COLLECTED: { providerType: 'THIRD_PARTY', collector: 'MERCHANT', beneficiary: 'PROVIDER', free: false, merchantPaysCost: false },
  THIRD_PARTY_DIRECT: { providerType: 'THIRD_PARTY', collector: 'PROVIDER', beneficiary: 'PROVIDER', free: false, merchantPaysCost: false },
  MERCHANT_SUBSIDIZED: { providerType: 'OWN', collector: 'NONE', beneficiary: 'NONE', free: true, merchantPaysCost: true },
  MERCHANT_SUBSIDIZED_EXTERNAL: { providerType: 'THIRD_PARTY', collector: 'NONE', beneficiary: 'NONE', free: true, merchantPaysCost: true }
}
export function policyFor(mode: DeliveryMode): Readonly<Policy> {
  if (!DELIVERY_MODES.includes(mode)) return invalid('Modalidad de entrega desconocida')
  return DELIVERY_POLICIES[mode]
}
export function validateMethod(method: Pick<DeliveryMethod, 'mode' | 'defaultFeeMinor' | 'allowFeeOverride'>): void {
  const policy = policyFor(method.mode)
  const fee = method.defaultFeeMinor === null ? null : readMinor(method.defaultFeeMinor)
  if (policy.free && (fee !== 0n || method.allowFeeOverride)) invalid('Esta modalidad debe tener tarifa cero y no permitir modificaciones')
  if (!policy.free && (fee === 0n || (fee === null && !method.allowFeeOverride))) invalid('Define una tarifa positiva o permite introducirla en caja')
}
export function distribution(mode: DeliveryMode, customerFeeMinor: string, providerCostMinor: string | null) {
  const { providerType, collector, beneficiary } = policyFor(mode)
  try {
    const d = calculateDeliveryDistribution(mode, displayMinor(customerFeeMinor), providerCostMinor === null ? null : displayMinor(providerCostMinor))
    return { providerType, collector, beneficiary,
      posChargeMinor: decimalToMinor(d.posCharge), externalChargeMinor: decimalToMinor(d.externalCharge),
      merchantRevenueMinor: decimalToMinor(d.merchantRevenue), thirdPartyPayableMinor: decimalToMinor(d.thirdPartyPayable),
      merchantCostMinor: d.merchantCost === null ? null : decimalToMinor(d.merchantCost) }
  } catch (error) { return invalid(error instanceof Error ? error.message : 'Importe de entrega inválido') }
}
export function quoteDelivery(method: DeliveryMethod, input: DeliveryQuoteInput): DeliveryTerms {
  if (!method.active) throw new DeliveryError('DELIVERY_CONFLICT', 'Modalidad deshabilitada')
  if (input.methodId !== method.id) invalid('Modalidad no coincide')
  if (input.expectedRevision != null && input.expectedRevision !== method.revision) throw new DeliveryError('DELIVERY_CONFLICT', 'La configuración de domicilio cambió; vuelve a cotizar')
  validateMethod(method)
  const requested = input.customerFee == null ? null : decimalToMinor(input.customerFee)
  if (requested !== null && !method.allowFeeOverride && requested !== method.defaultFeeMinor) invalid('La tarifa de esta modalidad es fija')
  const customerFeeMinor = requested ?? method.defaultFeeMinor ?? invalid('Indica la tarifa de domicilio')
  const providerCostMinor = input.providerCost == null ? null : decimalToMinor(input.providerCost)
  const terms = distribution(method.mode, customerFeeMinor, providerCostMinor)
  const providerName = input.providerName?.trim() || null
  const providerRef = input.providerRef?.trim() || null
  if (terms.providerType !== 'THIRD_PARTY' && (providerName || providerRef)) invalid('Solo corresponde un proveedor externo en modalidad de terceros')
  return { methodId: method.id, methodRevision: method.revision, methodCode: method.code, methodName: method.name,
    mode: method.mode, ...terms, providerName, providerRef, currency: 'COP', policyVersion: POLICY_VERSION,
    customerFeeMinor, providerCostMinor }
}
/** Called with exact merchandise net already computed by exact-cart-totals. Tips are not classified as merchant revenue. */
export function combineDelivery(merchandiseNet: string, delivery: DeliveryTerms, tip = '0.00') {
  assertDeliveryTerms(delivery)
  const total = computeSaleSettlement({merchandiseNet, tip, deliveryTerms: deliveryTermsFromMinor(delivery)})
  return {
    merchandiseNetMinor: decimalToMinor(total.merchandiseNet), tipMinor: decimalToMinor(total.tip),
    checkoutTotalMinor: decimalToMinor(total.checkoutTotal), customerTotalMinor: decimalToMinor(total.customerTotal!),
    merchantRevenueMinor: decimalToMinor(total.merchantRevenue!), thirdPartyPayableMinor: decimalToMinor(total.thirdPartyPayable!),
    merchantDeliveryCostMinor: total.merchantCost === null ? null : decimalToMinor(total.merchantCost)
  }
}
export function assertDeliveryTerms(terms: DeliveryTerms): void {
  if (terms.policyVersion !== POLICY_VERSION || terms.currency !== 'COP') invalid('Política financiera de domicilio no soportada')
  const expected = distribution(terms.mode, terms.customerFeeMinor, terms.providerCostMinor)
  for (const key of Object.keys(expected) as (keyof typeof expected)[]) {
    if (terms[key] !== expected[key]) invalid(`Snapshot inconsistente: ${key}`)
  }
}
const transitions: Readonly<Record<DeliveryStatus, readonly DeliveryStatus[]>> = {
  NOT_REQUIRED: [], PENDING: ['DISPATCHED', 'CANCELLED'], DISPATCHED: ['DELIVERED', 'CANCELLED'], DELIVERED: [], CANCELLED: []
}
export function assertTransition(from: DeliveryStatus, to: DeliveryStatus): void {
  if (!transitions[from]?.includes(to)) invalid(`Transición de entrega no permitida: ${from} → ${to}`)
}
