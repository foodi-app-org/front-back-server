// Definición del modelo subscriptions
import Sequelize from 'sequelize'

import connect from '../../db'

import subscriptionType from './subscriptionType'

const conn = connect()

export const SUBSCRIPTION_MODEL = 'subscriptions'

const Subscription = conn.define(SUBSCRIPTION_MODEL, {
  subscriptionId: {
    type: Sequelize.STRING(36),
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  subscriptionTypeId: {
    type: Sequelize.STRING,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    references: {
      model: subscriptionType,
      key: 'subscriptionTypeId'
    }
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  currentPeriodStart: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'current_period_start'
  },
  currentPeriodEnd: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'current_period_end'
  },
  businessName: {
    type: Sequelize.STRING(50),
    unique: true
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

export default Subscription
