import {
  DATE,
  INTEGER,
  literal,
  STRING,
  DECIMAL,
  UUIDV4
} from 'sequelize'

import connect from '../../db'

import Store from './Store'

const sequelize = connect()

export const STATUS_ORDER_MODEL = 'orderStatuses'

const StatusPedidosModel = sequelize.define(STATUS_ORDER_MODEL, {
  stPId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  id: {
    type: STRING(36),
    allowNull: true
  },
  tableId: {
    type: STRING(36),
    allowNull: true
  },
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
  pSState: {
    type: STRING(36),
    defaultValue: 0
  },
  valueDelivery: {
    type: DECIMAL(1000, 2),
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
    type: DECIMAL(1000, 2),
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
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: true
})

export default StatusPedidosModel
