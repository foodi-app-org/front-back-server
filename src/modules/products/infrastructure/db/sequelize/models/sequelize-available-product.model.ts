import {
  DataTypes,
  INTEGER,
  Model,
  Optional,
  SMALLINT,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const PRODUCT_AVAILABLE = 'product_availables'

export enum StateProductAvailable {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Interface that defines the attributes stored in DB
 */
export interface IStatusOrderStoreAttributes {
  availableProductId?: string
  pId?: string
  startDate?: string
  endDate?: string
  dayAvailable?: number
  state?: StateProductAvailable
  idStore?: string
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
export class SequelizeProductAvailableModel extends Model<IStatusOrderStoreAttributes, IStatusOrderStoreCreationAttributes> implements IStatusOrderStoreAttributes {
  declare pId: string
  declare idStore: string
  availableProductId?: string
  declare dayAvailable: number
  declare startDate: string
  declare endDate: string
  declare state: StateProductAvailable
  declare readonly createdAt: Date
  declare updatedAt?: Date
}

export const columnsAvailableProduct = {
  availableProductId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  // id store
  idStore: {
    type: STRING(36),
    allowNull: false
  },
  pId: {
    type: STRING(36),
    allowNull: true
  },
  dayAvailable: {
    type: INTEGER,
    allowNull: true
  },
  startDate: {
    type: STRING(5),
    allowNull: true,
    // 24h format HH:mm,
    defaultValue: '00:00'
  },
  endDate: {
    type: STRING(5),
    allowNull: true,
    // 24h format HH:mm,
    defaultValue: '23:59'
  },
  state: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: StateProductAvailable.ACTIVE
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
SequelizeProductAvailableModel.init(
  columnsAvailableProduct,
  {
    sequelize,
    modelName: PRODUCT_AVAILABLE,
    freezeTableName: true,
    timestamps: true
  }
)

export default  SequelizeProductAvailableModel
