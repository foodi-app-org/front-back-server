import type { CreateDeliveryMethod } from '../entities/delivery-method.entity'
export const DELIVERY_PRESETS: readonly CreateDeliveryMethod[] = [
  { code: 'NONE', name: 'Sin domicilio / retiro', mode: 'NONE', defaultFeeMinor: '0', allowFeeOverride: false, active: true },
  { code: 'MERCHANT', name: 'Domicilio propio', mode: 'MERCHANT', defaultFeeMinor: null, allowFeeOverride: true, active: false },
  { code: 'MERCHANT_EXTERNAL', name: 'Domicilio propio con proveedor externo', mode: 'MERCHANT_EXTERNAL', defaultFeeMinor: null, allowFeeOverride: true, active: false },
  { code: 'THIRD_PARTY_COLLECTED', name: 'Recaudo para domiciliario', mode: 'THIRD_PARTY_COLLECTED', defaultFeeMinor: null, allowFeeOverride: true, active: false },
  { code: 'THIRD_PARTY_DIRECT', name: 'Pago directo al domiciliario', mode: 'THIRD_PARTY_DIRECT', defaultFeeMinor: null, allowFeeOverride: true, active: false },
  { code: 'MERCHANT_SUBSIDIZED', name: 'Domicilio gratuito propio', mode: 'MERCHANT_SUBSIDIZED', defaultFeeMinor: '0', allowFeeOverride: false, active: false },
  { code: 'MERCHANT_SUBSIDIZED_EXTERNAL', name: 'Domicilio externo asumido por el comercio', mode: 'MERCHANT_SUBSIDIZED_EXTERNAL', defaultFeeMinor: '0', allowFeeOverride: false, active: false }
]
