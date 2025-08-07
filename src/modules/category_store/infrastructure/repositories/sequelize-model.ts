import {
  DataTypes,
  Model,
  Optional
} from 'sequelize'

import connect from '../../../../infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

sequelize.sync()

export const MODEL_CAT_STORE_NAME = 'category_stores'

/**
 * Interface that defines the attributes stored in DB
 */
export interface ICategoryStoreAttributes {
  catStore?: string
  pName: string
  ProDescription: string
  pState?: number
  ProImage?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during CategoryStore creation
 */
export type ICategoryStoreCreationAttributes = Optional<ICategoryStoreAttributes, 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeCategoryStoreModel
  extends Model<ICategoryStoreAttributes, ICategoryStoreCreationAttributes>
  implements ICategoryStoreAttributes {
  declare catStore: string
  declare pName: string
  declare ProDescription: string
  declare pState?: number
  declare ProImage?: string
  declare createdAt?: Date
  declare updatedAt?: Date
}

export const CategoryStoreColumns = {
  catStore: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  pName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ProDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pState: {
    type: DataTypes.SMALLINT,
    defaultValue: 1
  },
  ProImage: {
    type: DataTypes.STRING,
    allowNull: true
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

SequelizeCategoryStoreModel.init(
    CategoryStoreColumns,
  {
    sequelize,
    modelName: MODEL_CAT_STORE_NAME,
    freezeTableName: true,
    timestamps: false
  }
)

export default SequelizeCategoryStoreModel
