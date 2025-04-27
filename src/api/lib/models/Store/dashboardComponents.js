import Sequelize, { STRING, INTEGER } from 'sequelize'

import connect from '../../db'
import Users from '../Users'

import Store from './Store'

const conn = connect()

export const DASHBOARD_COMPONENTS = 'dashboard_components'

export default conn.define(DASHBOARD_COMPONENTS, {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: false
  },
  idStore: {
    unique: false,
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    }
  },
  coordinates: {
    type: Sequelize.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  createAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updateAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  tableName: DASHBOARD_COMPONENTS,
  timestamps: false
})
