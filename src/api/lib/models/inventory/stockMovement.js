import {
  UUID,
  UUIDV4,
  ENUM,
  INTEGER,
  STRING,
  DATE
} from 'sequelize'

import connect from '../../db'

const conn = connect()

export const movementTypes = Object.freeze({
  IN: 'IN',
  OUT: 'OUT',
  ADJUSTMENT: 'ADJUSTMENT'
})
export const STOCK_MOVEMENT_NAME = 'stockMovements'

export default conn.define(STOCK_MOVEMENT_NAME, {
  id: {
    type: UUID,
    primaryKey: true,
    allowNull: true
  },
  idstockMoment: {
    type: UUID,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: UUIDV4
  },
  productId: {
    type: UUID,
    allowNull: false
  },
  movementType: {
    type: ENUM('IN', 'OUT', 'ADJUSTMENT'),
    allowNull: false
  },
  quantity: {
    type: 'INTEGER',
    allowNull: false
  },
  previousStock: {
    type: INTEGER,
    allowNull: false
  },
  newStock: {
    type: INTEGER,
    allowNull: false
  },
  reference: {
    type: STRING,
    allowNull: true
  },
  createdAt: {
    type: DATE,
    defaultValue: Date.now()
  },
  updatedAt: {
    type: DATE,
    defaultValue: Date.now()
  }
}, {
  timestamps: false
})
