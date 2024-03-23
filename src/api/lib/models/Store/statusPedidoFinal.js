import {
  DATE,
  INTEGER,
  literal,
  STRING
} from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'

import Store from './Store'
const sequelize = connect()

export const STATUS_ORDER_MODEL = 'statuspedidos'

// sequelize.sync()

const StatusPedidosModel = sequelize.define(STATUS_ORDER_MODEL, {
  stPId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  id: {
    type: INTEGER,
    allowNull: true,
    get (x) { return enCode(this.getDataValue(x)) }

  },
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
  pSState: {
    type: INTEGER,
    defaultValue: 0
  },
  valueDelivery: {
    type: INTEGER,
    defaultValue: 0
  },
  locationUser: {
    type: STRING,
    allowNull: true
  },
  discount: {
    type: INTEGER,
    allowNull: true
  },
  tip: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  change: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  pCodeRef: {
    type: STRING(100),
    unique: true,
    allowNull: false
  },
  totalProductsPrice: {
    type: INTEGER,
    allowNull: false
  },
  payMethodPState: {
    type: INTEGER,
    defaultValue: 1
  },
  pickUp: {
    type: INTEGER,
    defaultValue: 0
  },
  channel: {
    type: INTEGER, // store or client-store
    defaultValue: 0
  },
  pPDate: {
    type: DATE
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

export default StatusPedidosModel
