import {
  DataTypes,
  Model,
  Optional,
  SMALLINT,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const TAGS_PRODUCT_MODEL_NAME = 'tags_products'

export enum states {
  ACTIVE = 1,
  INACTIVE = 0,
  DELETED = -1
}

/**
 * Interface that defines the attributes stored in DB
 */
export interface ITagProductAttributes {
  tgId: string
  idStore: string | null
  idUser: string | null
  nameTag: string
  state: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields allowed during creation
 */
export type ITagProductCreationAttributes = Optional<
  ITagProductAttributes,
  'tgId' | 'idStore' | 'idUser' | 'createdAt' | 'updatedAt'
>

/**
 * Sequelize Model definition
 */
export class SequelizeTagProductModel
  extends Model<ITagProductAttributes, ITagProductCreationAttributes>
  implements ITagProductAttributes {
  declare tgId: string
  declare idStore: string | null
  declare idUser: string | null
  declare nameTag: string
  declare state: number
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

/**
 * Column definitions for migration and model
 */
export const columnsTagsProduct = {
  tgId: {
    type: STRING(36),
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4
  },
  idStore: {
    type: STRING(36),
    allowNull: true
  },
  idUser: {
    type: STRING(36),
    allowNull: true
  },
  nameTag: {
    type: STRING,
    allowNull: false,
    unique: true
  },
  state: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: states.ACTIVE
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

SequelizeTagProductModel.init(columnsTagsProduct, {
  sequelize,
  modelName: TAGS_PRODUCT_MODEL_NAME,
  freezeTableName: true,
  timestamps: true
})

export default SequelizeTagProductModel
