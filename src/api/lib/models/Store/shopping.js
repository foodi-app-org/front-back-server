import Sequelize, { UUIDV4, STRING } from 'sequelize'

import connect from '../../db'
import Users from '../Users'

import Store from './Store'

const conn = connect()

export default conn.define('shopping', {
  shoId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false

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
  id: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }
  },
  shoName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  shoPrice: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  shoComments: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  shoState: {
    type: Sequelize.SMALLINT,
    allowNull: false
  },
  createAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updateAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false
})
