import Sequelize from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import { enCode } from '../../utils/util'

import Store from './Store'

const conn = connect()

export default conn.define('storefavoritesusers', {
  fIStoreId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  id: {
    type: Sequelize.INTEGER,
    onUpdate: null,
    onDelete: null,
    references: {
      model: Users,
      key: 'id'
    },
    get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
  },
  idStore: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,

    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  fState: {
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
