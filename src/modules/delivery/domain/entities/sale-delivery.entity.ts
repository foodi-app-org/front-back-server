import type { DeliveryMode, DeliveryParty, DeliveryProvider, MinorAmount } from './delivery-method.entity'
export type DeliveryStatus = 'NOT_REQUIRED' | 'PENDING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED'
export interface DeliveryTerms {
  methodId: string
  methodRevision: number
  methodCode: string
  methodName: string
  mode: DeliveryMode
  providerType: DeliveryProvider
  collector: DeliveryParty
  beneficiary: DeliveryParty
  providerName: string | null
  providerRef: string | null
  currency: 'COP'
  policyVersion: 1
  customerFeeMinor: MinorAmount
  providerCostMinor: MinorAmount | null
  posChargeMinor: MinorAmount
  externalChargeMinor: MinorAmount
  merchantRevenueMinor: MinorAmount
  thirdPartyPayableMinor: MinorAmount
  merchantCostMinor: MinorAmount | null
}
export interface SaleDelivery extends DeliveryTerms {
  id: string
  idStore: string
  saleId: string
  saleReference: string
  deliveryStatus: DeliveryStatus
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}
export interface DeliveryQuoteInput {
  methodId: string
  /** Decimal COP string, e.g. 5000.25; not minor units. */
  customerFee?: string | null
  providerCost?: string | null
  providerName?: string | null
  providerRef?: string | null
  expectedRevision?: number | null
}
