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

export enum StateProduct {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Interface that defines the attributes stored in DB
 */
export interface IStatusOrderStoreAttributes {
  pId?: string
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
  pName?: string
  tgId?: string
  pCode?: string
  ProPrice?: number
  vat?: number
  ProDescuento?: number
  ProUniDisponibles?: number
  ProDescription?: string
  pState?: StateProduct
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
export class SequelizeProductModel extends Model<IStatusOrderStoreAttributes, IStatusOrderStoreCreationAttributes> implements IStatusOrderStoreAttributes {
  pId?: string
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
  pName?: string
  tgId?: string
  pCode?: string
  ProPrice?: number
  vat?: number
  ProDescuento?: number
  ProUniDisponibles?: number
  ProDescription?: string
  pState?: StateProduct
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
  declare readonly createdAt: Date
  declare updatedAt: Date
}

export const columnsProduct = {
  pId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  idStore: {
    type: STRING(36),
    allowNull: true
  },
  // User
  id: {
    type: STRING(36),
    allowNull: true
  },
  // CATEGORY PRODUCT
  carProId: {
    type: STRING(36),
    allowNull: true
  },
  // Talla
  sizeId: {
    type: STRING(36),
    allowNull: true
  },
  // color
  colorId: {
    type: STRING(36),
    allowNull: true
  },
  // Locations
  cId: {
    type: STRING(36),
    allowNull: true,
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
    field: 'caId',

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
    validate: {
      min: 0
    }
  },
  manageStock: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true,
    validate: {
      isBoolean(value: boolean) {
        if (typeof value !== 'boolean') {
          throw new Error('manageStock must be a boolean')
        }
      }
    },
    field: 'manageStock'
  },
  previousStock: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0
    }
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
    defaultValue: 0.00,
    validate: {
      max: 999999999999.99,
      isDecimal: true
    }
  },
  vat: {
    type: DECIMAL(6, 2),
    allowNull: true,
    defaultValue: 0.00, // define un valor por defecto
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
    allowNull: false
  },
  // Si el producto esta asegurado ( Protegido )
  ProProtegido: {
    type: INTEGER,
    allowNull: true
  },
  // GARANTÍA )
  ProAssurance: {
    type: STRING,
    allowNull: true
  },
  // Numero de estrellas
  ProStar: {
    type: INTEGER,
    allowNull: true
  },
  ProImage: {
    type: STRING,
    trim: true,
    allowNull: true
  },
  // ---------------------
  // Ancho
  ProWidth: {
    type: INTEGER
  },
  // Alto
  ProHeight: {
    type: INTEGER,
    defaultValue: 1
  },
  free: {
    type: INTEGER,
    defaultValue: 0
  },
  // Largo
  ProLength: {
    type: STRING,
    defaultValue: 1
  },
  // Peso
  ProWeight: {
    type: STRING,
    defaultValue: 1
  },
  // -----------------------------Listo-----------------------------
  // Cantidad
  ProQuantity: {
    type: INTEGER,
    allowNull: true
  },
  // Destacado
  ProOutstanding: {
    type: INTEGER
  },
  // Entrega
  ProDelivery: {
    type: INTEGER
  },
  // Entrega
  ProVoltaje: {
    type: STRING,
    allowNull: true
  },
  ProBarCode: {
    type: STRING(50), // Espacio suficiente para cualquier tipo de código de barras, incluidos los alfanuméricos largos.
    allowNull: true,
    unique: true,
    validate: {
      len: [1, 50] as [number, number]
    }
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
SequelizeProductModel.init(
  columnsProduct,
  {
    sequelize,
    modelName: PRODUCT_MODEL,
    freezeTableName: true,
    timestamps: true
  }
)

export default SequelizeProductModel
