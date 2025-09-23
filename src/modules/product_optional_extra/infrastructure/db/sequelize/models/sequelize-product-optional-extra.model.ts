import {
  DataTypes,
  INTEGER,
  Model,
  Optional,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const PRODUCT_OPTIONAL_EXTRA_MODEL = 'products_optional_extras'

/**
 * Enum for state of the optional extra product
 */
export enum StateProductOptionalExtra {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Attributes stored in DB
 */
export interface IProductOptionalExtraAttributes {
  opExPid?: string
  pId?: string
  idStore?: string
  OptionalProName: string
  code?: string
  numbersOptionalOnly?: number
  state?: StateProductOptionalExtra
  required?: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Attributes allowed during creation
 */
export type IProductOptionalExtraCreationAttributes = Optional<
  IProductOptionalExtraAttributes,
  'opExPid' | 'createdAt' | 'updatedAt' | 'state' | 'required'
>

/**
 * Sequelize model definition
 */
export class SequelizeProductOptionalExtra
  extends Model<IProductOptionalExtraAttributes, IProductOptionalExtraCreationAttributes>
  implements IProductOptionalExtraAttributes {
  declare opExPid?: string
  declare pId: string
  declare idStore: string
  declare OptionalProName: string
  declare code: string
  declare numbersOptionalOnly: number
  declare state: StateProductOptionalExtra
  declare required: number
  declare createdAt?: Date
  declare updatedAt?: Date
}

/**
 * Column definitions
 */
export const columnsProductOptionalExtra = {
  opExPid: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  pId: {
    type: STRING(36),
    allowNull: true
  },
  idStore: {
    type: STRING(36),
    allowNull: false
  },
  OptionalProName: {
    type: STRING,
    allowNull: false,
    field: 'OptionalProName'
  },
  code: {
    type: STRING,
    allowNull: true
  },
  numbersOptionalOnly: {
    type: INTEGER,
    allowNull: true
  },
  state: {
    type: INTEGER,
    allowNull: false,
    defaultValue: StateProductOptionalExtra.ACTIVE
  },
  required: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0
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

SequelizeProductOptionalExtra.init(columnsProductOptionalExtra, {
  sequelize,
  modelName: PRODUCT_OPTIONAL_EXTRA_MODEL,
  freezeTableName: true,
  timestamps: false
})

export default SequelizeProductOptionalExtra
