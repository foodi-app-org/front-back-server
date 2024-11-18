import Sequelize, { STRING, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Users from '../Users'

import Store from './Store'

const conn = connect()
export default conn.define('contacts', {
  contactId: {
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
  cntName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cntNumberPhone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  cntComments: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  cntState: {
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
