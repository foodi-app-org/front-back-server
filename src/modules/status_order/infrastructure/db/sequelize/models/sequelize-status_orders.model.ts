import { DataTypes, DATE, DECIMAL, INTEGER, Model, Optional, STRING, UUIDV4 } from 'sequelize'
import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()
export const STATUS_ORDER_MODEL = 'orders_statuses'

export interface IStatusOrderStoreAttributes {
  stPId?: string
  id?: string
  tableId?: string
  idStore?: string
  idStatus: string
  boardStatusId?: string | null
  shoppingCartRefCode: string
  pSState: number
  valueDelivery?: number
  locationUser?: string
  discount?: number
  discountType?: string | null
  discountValue?: number | null
  discountAmount?: number | null
  netTotal?: number | null
  tip?: number
  change?: number
  pCodeRef: string
  totalProductsPrice: number
  payId?: string
  pickUp?: number
  channel?: number
  pPDate?: Date
  createdAt?: Date
  updatedAt?: Date
}

export type IStatusOrderStoreCreationAttributes = Optional<
  IStatusOrderStoreAttributes,
  'createdAt' | 'updatedAt' | 'boardStatusId'
>

export class SequelizeStatusOrderModel
  extends Model<IStatusOrderStoreAttributes, IStatusOrderStoreCreationAttributes>
  implements IStatusOrderStoreAttributes {
  declare stPId?: string
  declare id?: string
  declare tableId?: string
  declare idStatus: string
  declare boardStatusId?: string | null
  declare idStore?: string
  declare shoppingCartRefCode: string
  declare pSState: number
  declare valueDelivery?: number
  declare locationUser?: string
  declare discount?: number
  declare discountType?: string | null
  declare discountValue?: number | null
  declare discountAmount?: number | null
  declare netTotal?: number | null
  declare tip?: number
  declare change?: number
  declare pCodeRef: string
  declare totalProductsPrice: number
  declare payId?: string
  declare pickUp?: number
  declare channel?: number
  declare pPDate?: Date
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsStatusOrdersStore = {
  stPId: { type: STRING(36), primaryKey: true, autoIncrement: false, defaultValue: UUIDV4, allowNull: false },
  id: { type: STRING(36), allowNull: true },
  idStatus: { type: STRING(36), allowNull: false },
  // Independent operational status. Never use it in financial reconciliation.
  boardStatusId: { type: STRING(36), allowNull: true, defaultValue: null },
  tableId: { type: STRING(36), allowNull: true },
  idStore: { type: STRING(36), allowNull: true },
  pSState: { type: STRING(36), allowNull: false },
  valueDelivery: { type: INTEGER, defaultValue: 0 },
  locationUser: { type: STRING, allowNull: true },
  discount: { type: INTEGER, allowNull: true },
  discountType: { type: STRING(16), allowNull: true },
  discountValue: { type: INTEGER, allowNull: true },
  discountAmount: { type: DECIMAL(1000, 2), allowNull: true },
  netTotal: { type: DECIMAL(1000, 2), allowNull: true },
  tip: { type: INTEGER, allowNull: true, defaultValue: 0 },
  change: { type: INTEGER, allowNull: true, defaultValue: 0 },
  shoppingCartRefCode: { type: STRING(100), allowNull: false },
  pCodeRef: { type: STRING(100), unique: true, allowNull: false },
  totalProductsPrice: { type: DECIMAL(1000, 2), allowNull: false },
  payId: { type: STRING(36), allowNull: true },
  pickUp: { type: INTEGER, defaultValue: 0 },
  channel: { type: INTEGER, defaultValue: 0 },
  pPDate: { type: DATE },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}

SequelizeStatusOrderModel.init(columnsStatusOrdersStore, {
  sequelize, modelName: STATUS_ORDER_MODEL,
  freezeTableName: true, timestamps: true
})
export default SequelizeStatusOrderModel
