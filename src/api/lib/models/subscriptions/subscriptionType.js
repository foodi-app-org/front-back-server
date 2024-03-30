import Sequelize from 'sequelize'

import connect from '../../db'

const conn = connect()

export const SUBSCRIPTION_TYPES_TABLE = 'subscription_types'

export default conn.define(SUBSCRIPTION_TYPES_TABLE, {
  subscriptionTypeId: {
    type: Sequelize.STRING(36),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true
  },
  description: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  priceMonth: {
    type: Sequelize.STRING(10),
    allowNull: true
  },
  priceYear: {
    type: Sequelize.STRING(20),
    allowNull: true
  },
  modules: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  priceMonthId: {
    type: Sequelize.STRING(100),
    allowNull: true,
    unique: true
  },
  priceYearId: {
    type: Sequelize.STRING(100),
    allowNull: true,
    unique: true
  },
  storageSize: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false
})
