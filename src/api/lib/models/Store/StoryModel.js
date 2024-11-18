import Sequelize, { STRING, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Users from '../Users'

import Store from './Store'

const conn = connect()

export default conn.define('storystore', {
  stoId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  id: {
    type: STRING(36),
    onUpdate: null,
    onDelete: null,
    references: {
      model: Users,
      key: 'id'
    }

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
  nameStore: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sState: {
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
