import {
  BOOLEAN,
  DataTypes,
  DECIMAL,
  INTEGER,
  Model,
  Optional,
  SMALLINT,
  STRING,
  TEXT,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const PRODUCT_MODEL = 'product_models'
export const ASSOCIATION_PRODUCTS_NAME = 'products'

export enum StateProduct {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Interface that defines the attributes stored in DB
 */
export interface IProductAttributes {
  pId: string
  idStore?: string
  id?: string
  carProId?: string
  sizeId?: string
  colorId?: string
  cId?: string
  dId?: string
  ctId?: string
  fId?: string
  caId?: string
  poPriority?: number
  stock?: number
  manageStock?: boolean
  previousStock?: number
  valueDelivery?: number
  pName: string
  tgId?: string
  pCode: string
  ProPrice?: number
  vat?: number
  ProDescuento?: number
  ProUniDisponibles?: number
  ProDescription?: string
  pState: StateProduct
  sTateLogistic?: number
  ProProtegido?: number
  ProAssurance?: string
  ProStar?: number
  ProImage?: string
  ProWidth?: number
  ProHeight?: number
  free?: number
  ProLength?: string
  ProWeight?: string
  ProQuantity?: number
  ProOutstanding?: number
  ProDelivery?: number
  ProVoltaje?: string
  ProBarCode?: string
  originalPid?: string
  pCodeRef?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during creation
 */
export type IProductCreationAttributes = Optional<
  IProductAttributes,
  'pId' | 'createdAt' | 'updatedAt'
>

/**
 * Sequelize Model definition
 */
export class SequelizeProductModel
  extends Model<IProductAttributes, IProductCreationAttributes>
  implements IProductAttributes {
  declare pId: string
  declare idStore?: string
  declare id?: string
  declare carProId?: string
  declare sizeId?: string
  declare colorId?: string
  declare cId?: string
  declare dId?: string
  declare ctId?: string
  declare fId?: string
  declare caId?: string
  declare poPriority?: number
  declare stock?: number
  declare manageStock?: boolean
  declare previousStock?: number
  declare valueDelivery?: number
  declare pName: string
  declare tgId?: string
  declare pCode: string
  declare ProPrice?: number
  declare vat?: number
  declare ProDescuento?: number
  declare ProUniDisponibles?: number
  declare ProDescription?: string
  declare pState: StateProduct
  declare sTateLogistic?: number
  declare ProProtegido?: number
  declare ProAssurance?: string
  declare ProStar?: number
  declare ProImage?: string
  declare ProWidth?: number
  declare ProHeight?: number
  declare free?: number
  declare ProLength?: string
  declare ProWeight?: string
  declare ProQuantity?: number
  declare ProOutstanding?: number
  declare ProDelivery?: number
  declare ProVoltaje?: string
  declare ProBarCode?: string
  declare originalPid?: string
  declare pCodeRef?: string
  declare readonly createdAt: Date
  declare updatedAt: Date
}

export const columnsProduct = {
  pId: {
    // type: STRING(36),
    type: DataTypes.UUID,
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false,
    unique: true
  },
  idStore: {
    type: STRING(36),
    allowNull: true
  },
  id: {
    type: STRING(36),
    allowNull: true
  },
  carProId: {
    type: STRING(36),
    allowNull: true
  },
  sizeId: {
    type: STRING(36),
    allowNull: true
  },
  colorId: {
    type: STRING(36),
    allowNull: true
  },
  cId: {
    type: STRING(36),
    allowNull: true
  },
  dId: {
    type: STRING(36),
    allowNull: true
  },
  ctId: {
    type: STRING(36),
    allowNull: true
  },
  fId: {
    type: STRING(36),
    field: 'fId'
  },
  caId: {
    type: STRING(36),
    field: 'caId'
  },
  poPriority: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: 1
  },
  stock: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: { min: 0 }
  },
  manageStock: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true,
    validate: {
      isBoolean(value: boolean) {
        if (typeof value !== 'boolean') throw new Error('manageStock must be a boolean')
      }
    },
    field: 'manageStock'
  },
  previousStock: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: { min: 0 }
  },
  valueDelivery: {
    type: DECIMAL(1000, 2),
    allowNull: true,
    defaultValue: 0
  },
  pName: {
    type: STRING,
    allowNull: false
  },
  tgId: {
    type: STRING,
    allowNull: true
  },
  pCode: {
    type: STRING(100),
    allowNull: false
  },
  ProPrice: {
    type: DECIMAL(1000, 2),
    allowNull: true,
    defaultValue: 0.0,
    validate: {
      max: 999999999999.99,
      isDecimal: true
    }
  },
  vat: {
    type: DECIMAL(6, 2),
    allowNull: true,
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 100
    }
  },
  ProDescuento: {
    type: DECIMAL(1000, 2),
    allowNull: true
  },
  ProUniDisponibles: {
    type: INTEGER,
    allowNull: true
  },
  ProDescription: {
    type: TEXT,
    allowNull: true
  },
  pState: {
    type: INTEGER,
    allowNull: false
  },
  sTateLogistic: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  ProProtegido: {
    type: INTEGER,
    allowNull: true
  },
  ProAssurance: {
    type: STRING,
    allowNull: true
  },
  ProStar: {
    type: INTEGER,
    allowNull: true
  },
  ProImage: {
    type: STRING,
    allowNull: true
  },
  ProWidth: {
    type: INTEGER
  },
  ProHeight: {
    type: INTEGER,
    defaultValue: 1
  },
  free: {
    type: INTEGER,
    defaultValue: 0
  },
  ProLength: {
    type: STRING,
    defaultValue: '1'
  },
  ProWeight: {
    type: STRING,
    defaultValue: '1'
  },
  ProQuantity: {
    type: INTEGER,
    allowNull: true
  },
  ProOutstanding: {
    type: INTEGER
  },
  ProDelivery: {
    type: INTEGER
  },
  ProVoltaje: {
    type: STRING,
    allowNull: true
  },
  ProBarCode: {
    type: STRING(50),
    allowNull: true,
    unique: true,
    validate: { len: [1, 50] as [number, number] }
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

SequelizeProductModel.init(columnsProduct, {
  sequelize,
  modelName: PRODUCT_MODEL,
  freezeTableName: true,
  timestamps: true
})

export default SequelizeProductModel
