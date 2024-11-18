import Sequelize, { INTEGER } from 'sequelize'

import connect from '../../db'

const conn = connect()

export default conn.define('tenant', {
  tenantId: {
    type: INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  subdomain: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true
  },
  schemaName: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  // subscriptionId: {
  //   type: Sequelize.STRING(36),
  //   allowNull: false,
  //   unique: true,
  //   references: {
  //     model: 'subscriptions',
  //     key: 'subscription_id'
  //   }
  // },
  // storageId: {
  //   type: Sequelize.STRING(36),
  //   allowNull: true,
  //   unique: true,
  //   references: {
  //     model: 'storages',
  //     key: 'storage_id'
  //   }
  // },
  subscriberId: {
    type: Sequelize.STRING(36),
    allowNull: false,
    unique: true
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  mailBody: {
    type: Sequelize.STRING(250),
    defaultValue: ''
  }
}, {
  timestamps: false
})
