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
  catStore: string
  cName: string
  csDescription: string
  cState?: number
  cPathImage?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during CategoryStore creation
 */
export type ICategoryStoreCreationAttributes = Optional<ICategoryStoreAttributes, 'catStore' | 'cState' | 'cPathImage' | 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeCategoryStoreModel
  extends Model<ICategoryStoreAttributes, ICategoryStoreCreationAttributes>
  implements ICategoryStoreAttributes
{
  declare catStore: string
  declare cName: string
  declare csDescription: string
  declare cState?: number
  declare cPathImage?: string
  declare createdAt?: Date
  declare updatedAt?: Date
}

SequelizeCategoryStoreModel.init(
  {
    catStore: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    cName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    csDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cState: {
      type: DataTypes.SMALLINT,
      defaultValue: 1
    },
    cPathImage: {
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
  },
  {
    sequelize,
    modelName: MODEL_CAT_STORE_NAME,
    freezeTableName: true,
    timestamps: false
  }
)

export default SequelizeCategoryStoreModel
