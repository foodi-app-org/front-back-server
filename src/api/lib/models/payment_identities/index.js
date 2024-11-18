import Sequelize, { UUIDV4, STRING } from 'sequelize'

import connect from '../../db'

const conn = connect()

export default conn.define('payment_identities', {
  id: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  data: {
    type: Sequelize.JSONB,
    allowNull: false,
    unique: false
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
