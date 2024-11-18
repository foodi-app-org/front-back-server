import { INTEGER, STRING, TEXT, literal, DECIMAL, UUIDV4 } from 'sequelize'

import connect from '../../db'
import SizeModel from '../information/size'
import colorModel from '../information/color'
import CountriesModel from '../information/CountriesModel'
import DepartmentsModel from '../information/DepartmentsModel'
import CitiesModel from '../information/CitiesModel'
import Feature from '../feature/feature'
import CategoryProductsModel from '../Categories/CategoryProducts'

const sequelize = connect()

const productModel = sequelize.define('product', {
  pId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
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
  // poPriority: {
  //     type: Sequelize.SMALLINT,
  //     allowNull: false,
  //     defaultValue: 1,
  //     validate: {
  //         isValidate (value) {
  //             validations(value, false, false, 0, 0, false, true)
  //         }
  //     }
  // },
  pName: {
    type: STRING,
    allowNull: false
  },
  ProPrice: {
    type: STRING,
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
  timestamps: false
})

export default productModel
