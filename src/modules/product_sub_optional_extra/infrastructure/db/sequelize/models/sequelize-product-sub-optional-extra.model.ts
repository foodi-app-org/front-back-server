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

export const PRODUCT_SUB_OPTIONAL_EXTRA = 'products_sub_optional_extras'

/**
 * Enum for state of the optional extra product
 */
export enum StateProductSubOptionalExtra {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Attributes stored in DB
 */
export interface IProductOptionalExtraAttributes {
  opSubExPid?: string
  pId: string
  idStore: string
  opExPid?: string
  OptionalSubProName: string
  exCodeOptionExtra: string
  exCode: string
  state?: StateProductSubOptionalExtra
  required?: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Attributes allowed during creation
 */
export type IProductOptionalExtraCreationAttributes = Optional<
  IProductOptionalExtraAttributes,
  'opSubExPid' | 'createdAt' | 'updatedAt' | 'state' | 'required'
>

/**
 * Sequelize model definition
 */
export class SequelizeProductSubOptionalExtra
  extends Model<IProductOptionalExtraAttributes, IProductOptionalExtraCreationAttributes>
  implements IProductOptionalExtraAttributes {
  opSubExPid?: string
  declare pId: string
  declare idStore: string
  declare opExPid?: string
  declare OptionalSubProName: string
  declare exCodeOptionExtra: string
  declare exCode: string
  declare state: StateProductSubOptionalExtra
  declare required: number
  declare createdAt?: Date
  declare updatedAt?: Date
}

/**
 * Column definitions
 */
export const columnsProductSubOptionalExtra = {
  opSubExPid: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  pId: {
    type: STRING(36),
    allowNull: false
  },
  idStore: {
    type: STRING(36),
    allowNull: false
  },
  opExPid: {
    type: STRING(36),
    allowNull: true
  },
  OptionalSubProName: {
    type: STRING,
    allowNull: false
  },
  exCodeOptionExtra: {
    type: STRING,
    allowNull: false
  },
  exCode: { 
    type: STRING, // relation with module product_optional_extra
    allowNull: false
  },
  state: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1
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

SequelizeProductSubOptionalExtra.init(columnsProductSubOptionalExtra, {
  sequelize,
  modelName: PRODUCT_SUB_OPTIONAL_EXTRA,
  freezeTableName: true,
  timestamps: false
})

export default SequelizeProductSubOptionalExtra
