import {
  INTEGER,
  STRING,
  UUIDV4,
  Model,
  Optional,
  DataTypes
} from "sequelize"

import connect from '../../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const EXTRA_PRODUCT_MODEL = 'products_extras'

/**
 * Enum for exState of the extra product
 */
export enum StateProductExtra {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Attributes stored in DB
 */
export interface IProductExtraAttributes {
  exPid?: string
  pId?: string
  idStore?: string
  extraName: string
  exState?: StateProductExtra
  required?: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Attributes allowed during creation
 */
export type IProductExtraCreationAttributes = Optional<
  IProductExtraAttributes,
  "exPid" | "createdAt" | "updatedAt" | "exState" | "required"
>

/**
 * Sequelize model definition
 */
export class SequelizeProductExtra
  extends Model<IProductExtraAttributes, IProductExtraCreationAttributes>
  implements IProductExtraAttributes {
  declare exPid?: string
  declare pId: string
  declare idStore: string
  declare extraName: string
  declare exState: StateProductExtra
  declare required: number
  declare createdAt?: Date
  declare updatedAt?: Date
}

/**
 * Column definitions
 */
export const columnsProductExtra = {
  exPid: {
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
  numbersOptionalOnly: {
    type: INTEGER,
    allowNull: true
  },
  exState: {
    type: INTEGER,
    allowNull: false,
    defaultValue: StateProductExtra.ACTIVE
  },
  extraName: {
    type: STRING,
    allowNull: false
  },
  required: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  extraPrice: {
    type: DataTypes.DECIMAL(10, 2),
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

SequelizeProductExtra.init(columnsProductExtra, {
  sequelize,
  modelName: EXTRA_PRODUCT_MODEL,
  freezeTableName: true,
  timestamps: false
})

export default SequelizeProductExtra
