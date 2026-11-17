import { DataTypes, Model, type Optional } from 'sequelize'
import connect from '@shared/infrastructure/db/sequelize/sequelize.connect'

/** Schema is selected by .schema(getTenantName(storeId)) or migration; never sequelize.sync(). */
const sequelize = connect()
export const MODEL_SALE_REFUNDS = 'sale_refunds'
export const MODEL_SALE_REFUND_ITEMS = 'sale_refund_items'

export interface SaleRefundAttributes {
  id: string; idStore: string; saleId: string; originalPaymentId: string; saleReference: string
  cashSessionId: string | null; status: string; scope: string; amountMinor: string
  reason: string; requestedBy: string; requestedAt: string; idempotencyKey: string
  requestHash: string; confirmedBy: string | null; confirmedAt: string | null; paymentId: string | null
  externalReference: string | null; confirmationKey: string | null; confirmationHash: string | null
  cancelReason: string | null; cancelledBy: string | null; cancelledAt: string | null
  cancelKey: string | null; cancelHash: string | null
}
export type RefundCreation = Optional<SaleRefundAttributes,
  'cashSessionId'|'confirmedBy'|'confirmedAt'|'paymentId'|'externalReference'|'confirmationKey'|'confirmationHash'|
  'cancelReason'|'cancelledBy'|'cancelledAt'|'cancelKey'|'cancelHash'>
export class SequelizeSaleRefundModel extends Model<SaleRefundAttributes, RefundCreation> implements SaleRefundAttributes {
  declare id:string; declare idStore:string; declare saleId:string; declare originalPaymentId:string
  declare saleReference:string; declare cashSessionId:string|null; declare status:string; declare scope:string
  declare amountMinor:string; declare reason:string; declare requestedBy:string; declare requestedAt:string
  declare idempotencyKey:string; declare requestHash:string; declare confirmedBy:string|null
  declare confirmedAt:string|null; declare paymentId:string|null; declare externalReference:string|null
  declare confirmationKey:string|null; declare confirmationHash:string|null; declare cancelReason:string|null
  declare cancelledBy:string|null; declare cancelledAt:string|null; declare cancelKey:string|null; declare cancelHash:string|null
}
export const SaleRefundColumns = {
  id: { type: DataTypes.STRING(36), allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  idStore: { type: DataTypes.STRING(36), allowNull: false },
  saleId: { type: DataTypes.STRING(36), allowNull: false },
  originalPaymentId: { type: DataTypes.STRING(36), allowNull: false },
  saleReference: { type: DataTypes.STRING(100), allowNull: false },
  cashSessionId: { type: DataTypes.STRING(36), allowNull: true },
  status: { type: DataTypes.STRING(32), allowNull: false },
  scope: { type: DataTypes.STRING(24), allowNull: false },
  amountMinor: { type: DataTypes.BIGINT, allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: false },
  requestedBy: { type: DataTypes.STRING(100), allowNull: false },
  requestedAt: { type: DataTypes.DATE, allowNull: false },
  idempotencyKey: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  requestHash: { type: DataTypes.STRING(64), allowNull: false },
  confirmedBy: { type: DataTypes.STRING(100), allowNull: true },
  confirmedAt: { type: DataTypes.DATE, allowNull: true },
  paymentId: { type: DataTypes.STRING(36), allowNull: true, unique: true },
  externalReference: { type: DataTypes.STRING(200), allowNull: true, unique: true },
  confirmationKey: { type: DataTypes.STRING(100), allowNull: true, unique: true },
  confirmationHash: { type: DataTypes.STRING(64), allowNull: true },
  cancelReason: { type: DataTypes.TEXT, allowNull: true },
  cancelledBy: { type: DataTypes.STRING(100), allowNull: true },
  cancelledAt: { type: DataTypes.DATE, allowNull: true },
  cancelKey: { type: DataTypes.STRING(100), allowNull: true, unique: true },
  cancelHash: { type: DataTypes.STRING(64), allowNull: true }
}
SequelizeSaleRefundModel.init(SaleRefundColumns, { sequelize, modelName: MODEL_SALE_REFUNDS,
  freezeTableName: true, timestamps: false })

export interface SaleRefundItemAttributes {
  id: string; idStore: string; refundId: string; shoppingCartId: string
  quantity: number; amountMinor: string; disposition: string
}
export class SequelizeSaleRefundItemModel extends Model<SaleRefundItemAttributes> implements SaleRefundItemAttributes {
  declare id:string; declare idStore:string; declare refundId:string; declare shoppingCartId:string
  declare quantity:number; declare amountMinor:string; declare disposition:string
}
export const SaleRefundItemColumns = {
  id: { type: DataTypes.STRING(36), allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  idStore: { type: DataTypes.STRING(36), allowNull: false },
  refundId: { type: DataTypes.STRING(36), allowNull: false },
  shoppingCartId: { type: DataTypes.STRING(36), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  amountMinor: { type: DataTypes.BIGINT, allowNull: false },
  disposition: { type: DataTypes.STRING(12), allowNull: false }
}
SequelizeSaleRefundItemModel.init(SaleRefundItemColumns, { sequelize, modelName: MODEL_SALE_REFUND_ITEMS,
  freezeTableName: true, timestamps: false })
