import { BIGINT, DATE, INTEGER, Model, STRING } from 'sequelize'
import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import type { SaleDelivery, DeliveryStatus } from '../../../../domain/entities/sale-delivery.entity'
import type { DeliveryMode, DeliveryParty, DeliveryProvider } from '../../../../domain/entities/delivery-method.entity'
export const SALE_DELIVERY_MODEL = 'sale_deliveries'

export class SequelizeSaleDelivery extends Model<SaleDelivery, SaleDelivery> implements SaleDelivery {
  declare id: string; declare idStore: string; declare saleId: string; declare saleReference: string
  declare methodId: string; declare methodRevision: number; declare methodCode: string; declare methodName: string
  declare mode: DeliveryMode; declare providerType: DeliveryProvider; declare collector: DeliveryParty; declare beneficiary: DeliveryParty
  declare providerName: string | null; declare providerRef: string | null; declare currency: 'COP'; declare policyVersion: 1
  declare customerFeeMinor: string; declare providerCostMinor: string | null; declare posChargeMinor: string; declare externalChargeMinor: string
  declare merchantRevenueMinor: string; declare thirdPartyPayableMinor: string; declare merchantCostMinor: string | null
  declare deliveryStatus: DeliveryStatus; declare createdBy: string; declare updatedBy: string; declare createdAt: Date; declare updatedAt: Date
}
const money = (allowNull = false) => ({ type: BIGINT, allowNull })
export const columnsSaleDelivery = {
  id: { type: STRING(36), primaryKey: true, allowNull: false }, idStore: { type: STRING(36), allowNull: false },
  saleId: { type: STRING(36), allowNull: false, unique: true }, saleReference: { type: STRING(100), allowNull: false, unique: true },
  methodId: { type: STRING(36), allowNull: false }, methodRevision: { type: INTEGER, allowNull: false },
  methodCode: { type: STRING(48), allowNull: false }, methodName: { type: STRING(120), allowNull: false }, mode: { type: STRING(40), allowNull: false },
  providerType: { type: STRING(16), allowNull: false }, collector: { type: STRING(16), allowNull: false }, beneficiary: { type: STRING(16), allowNull: false },
  providerName: { type: STRING(120), allowNull: true }, providerRef: { type: STRING(100), allowNull: true },
  currency: { type: STRING(3), allowNull: false }, policyVersion: { type: INTEGER, allowNull: false },
  customerFeeMinor: money(), providerCostMinor: money(true), posChargeMinor: money(), externalChargeMinor: money(), merchantRevenueMinor: money(), thirdPartyPayableMinor: money(), merchantCostMinor: money(true),
  deliveryStatus: { type: STRING(20), allowNull: false }, createdBy: { type: STRING(36), allowNull: false }, updatedBy: { type: STRING(36), allowNull: false },
  createdAt: { type: DATE, allowNull: false }, updatedAt: { type: DATE, allowNull: false }
}
SequelizeSaleDelivery.init(columnsSaleDelivery, { sequelize: connect(), modelName: SALE_DELIVERY_MODEL, freezeTableName: true, timestamps: true })
