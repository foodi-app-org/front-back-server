import {
  DataTypes,
  DATE,
  DECIMAL,
  INTEGER,
  Model,
  Optional,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const STATUS_ORDER_MODEL = 'orders_statuses'

/**
 * Interface that defines the attributes stored in DB
 */
export interface IStatusOrderStoreAttributes {
  stPId?: string
  id?: string
  tableId?: string
  idStore?: string
  pSState: number
  valueDelivery?: number
  locationUser?: string
  discount?: number
  tip?: number
  change?: number
  pCodeRef: string
  totalProductsPrice: number
  payMethodPState?: number
  pickUp?: number
  channel?: number
  pPDate?: Date
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during User creation
 */
export type IStatusOrderStoreCreationAttributes = Optional<IStatusOrderStoreAttributes, 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeStatusOrderModel extends Model<IStatusOrderStoreAttributes, IStatusOrderStoreCreationAttributes> implements IStatusOrderStoreAttributes {
  declare stPId?: string
  declare id?: string
  declare tableId?: string
  declare idStore?: string
  declare shoppingCartRefCode: string
  declare pSState: number
  declare valueDelivery?: number
  declare locationUser?: string
  declare discount?: number
  declare tip?: number
  declare change?: number
  declare pCodeRef: string
  declare totalProductsPrice: number
  declare payMethodPState?: number
  declare pickUp?: number
  declare channel?: number
  declare pPDate?: Date
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsStatusOrdersStore = {
  stPId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  id: {
    type: STRING(36),
    allowNull: true
  },
  tableId: {
    type: STRING(36),
    allowNull: true
  },
  idStore: {
    type: STRING(36),
    allowNull: true,
  },
  pSState: {
    type: STRING(36),
    allowNull: false
    // relation with: STATUS_ORDER_MODEL,
  },
  valueDelivery: {
    type: INTEGER,
    defaultValue: 0
  },
  locationUser: {
    type: STRING,
    allowNull: true
  },
  discount: {
    type: INTEGER,
    allowNull: true
  },
  tip: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  change: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  shoppingCartRefCode: {
    type: STRING(100),
    allowNull: false
  },
  pCodeRef: {
    type: STRING(100),
    unique: true,
    allowNull: false
  },
  totalProductsPrice: {
    type: DECIMAL(1000, 2),
    allowNull: false
  },
  payMethodPState: {
    type: INTEGER,
    defaultValue: 1
  },
  pickUp: {
    type: INTEGER,
    defaultValue: 0
  },
  channel: {
    type: INTEGER, // store or client-store
    defaultValue: 0,
  },
  pPDate: {
    type: DATE
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}
SequelizeStatusOrderModel.init(
  columnsStatusOrdersStore,
  {
    sequelize,
    modelName: STATUS_ORDER_MODEL,
    freezeTableName: true,
    timestamps: true
  }
)

export default SequelizeStatusOrderModel
