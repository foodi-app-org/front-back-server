import {
  INTEGER,
  STRING,
  TEXT,
  literal,
  SMALLINT,
  DECIMAL,
  UUIDV4,
  BOOLEAN
} from 'sequelize'

import connect from '../../db'
import SizeModel from '../information/size'
import colorModel from '../information/color'
import CountriesModel from '../information/CountriesModel'
import DepartmentsModel from '../information/DepartmentsModel'
import CitiesModel from '../information/CitiesModel'
import Feature from '../feature/feature'
import CategoryProductsModel from '../Categories/CategoryProducts'
import Users from '../Users'
import Store from '../Store/Store'
import catProducts from '../Store/cat'

const crypto = require('crypto')

const sequelize = connect()

export const PRODUCT_FOOD_MODEL = 'productmodelfoods'

const productModelFood = sequelize.define(PRODUCT_FOOD_MODEL, {
  pId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  // id store
  idStore: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    }
  },
  // User
  id: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }

  },
  // CATEGORY PRODUCT
  carProId: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: catProducts,
      key: 'carProId'
    }

  },
  // Talla
  sizeId: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: SizeModel,
      key: 'sizeId'
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
  // color
  colorId: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: colorModel,
      key: 'colorId'
    }

  },
  // Locations
  cId: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: CountriesModel,
      key: 'cId'
    }

  },
  dId: {
    type: STRING(36),
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: true,
    references: {
      model: DepartmentsModel,
      key: 'dId'
    }

  },
  ctId: {
    type: STRING(36),
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: true,
    references: {
      model: CitiesModel,
      key: 'ctId'
    }

  },
  fId: {
    type: STRING(36),
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Feature,
      key: 'fId'
    }

  },
  caId: {
    type: STRING(36),
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: CategoryProductsModel,
      key: 'caId'
    }

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
    defaultValue: false,
    validate: {
      isBoolean (value) {
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
  poPriority: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: 1
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
  pCode: {
    type: STRING(100),
    allowNull: false
  },
  ProPrice: {
    type: DECIMAL(1000, 2),
    allowNull: true
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
      len: [1, 50]
    }
  },
  pDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  pDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false,
  hooks: {
    beforeCreate(product) {
      if (!product.ProBarCode) {
        product.ProBarCode = crypto.randomBytes(6).toString('hex').toUpperCase()
      }
    },
    beforeUpdate(product) {
      product.pDatMod = literal('CURRENT_TIMESTAMP')
    }
  }
})

export default productModelFood
