import {
  BOOLEAN,
  INTEGER,
  literal,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const ORDER_STATUS_TYPE_MODEL = 'order_status_types'

export const OrderStatusTypeModel = sequelize.define(ORDER_STATUS_TYPE_MODEL, {
  idStatus: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  description: {
    type: STRING,
    allowNull: true
  },
  color: {
    type: STRING(10), // Ej: "#FFFFFF"
    allowNull: true
  },
  backgroundColor: {
    type: STRING(10), // Ej: "#FFFFFF"
    allowNull: true
  },
  state: {
    type: INTEGER,
    allowNull: false
  },
  active: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  priority: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0
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
