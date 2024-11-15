import { INTEGER, STRING, TEXT, SMALLINT, literal, DECIMAL } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
import Users from '../Users'
import Store from '../Store/Store'

const sequelize = connect()

const productModel = sequelize.define('productstore', {
  pfId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  // User
  id: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  // id store
  idStore: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  pName: {
    type: STRING,
    allowNull: false
  },
  ProPrice: {
    type: INTEGER,
    allowNull: true
  },
  ProDescuento: {
    type: DECIMAL(1000, 2),
    allowNull: true
  },
  ProDescription: {
    type: TEXT,
    allowNull: true
  },
  pState: {
    type: INTEGER(4),
    allowNull: false,
    defaultValue: 1
  },
  sTateLogistic: {
    type: INTEGER(4),
    allowNull: false,
    defaultValue: 1

  },
  // Numero de estrellas
  ProStar: {
    type: INTEGER,
    allowNull: true
  },
  ProImage: {
    type: TEXT,
    allowNull: true
  },
  // ---------------------
  // Alto
  ProHeight: {
    type: STRING,
    defaultValue: 1
  },
  // Peso
  ProWeight: {
    type: STRING,
    defaultValue: 1
  },
  // -----------------------------Listo-----------------------------
  // Destacado
  ProOutstanding: {
    type: SMALLINT
  },
  // Entrega
  ProDelivery: {
    type: SMALLINT,
    defaultValue: 0

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
