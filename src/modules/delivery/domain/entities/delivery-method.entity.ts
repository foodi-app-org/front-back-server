export const DELIVERY_MODES = ['NONE', 'MERCHANT', 'MERCHANT_EXTERNAL', 'THIRD_PARTY_COLLECTED', 'THIRD_PARTY_DIRECT', 'MERCHANT_SUBSIDIZED', 'MERCHANT_SUBSIDIZED_EXTERNAL'] as const
export type DeliveryMode = typeof DELIVERY_MODES[number]
export type DeliveryProvider = 'NONE' | 'OWN' | 'THIRD_PARTY'
export type DeliveryParty = 'NONE' | 'MERCHANT' | 'PROVIDER'
/** Canonical non-negative integer minor units, serialized as a string. */
export type MinorAmount = string
export interface DeliveryMethod {
  id: string
  idStore: string
  code: string
  name: string
  mode: DeliveryMode
  defaultFeeMinor: MinorAmount | null
  allowFeeOverride: boolean
  active: boolean
  revision: number
  createdBy: string | null
  updatedBy: string | null
  createdAt: Date
  updatedAt: Date
}
export type CreateDeliveryMethod = Pick<DeliveryMethod, 'code' | 'name' | 'mode' | 'defaultFeeMinor' | 'allowFeeOverride' | 'active'>
export type UpdateDeliveryMethod = Partial<Pick<DeliveryMethod, 'name' | 'defaultFeeMinor' | 'allowFeeOverride' | 'active'>>
