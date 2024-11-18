import Sequelize, { STRING, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Users from '../Users'

import Store from './Store'

const conn = connect()

export default conn.define('ratingstore', {
  rId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  id: {
    type: STRING(36),
    onUpdate: null,
    unique: true,
    onDelete: null,
    references: {
      model: Users,
      key: 'id'
    }

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
  rAppearance: {
    type: Sequelize.SMALLINT,
    allowNull: true
  },
  rTasty: {
    type: Sequelize.SMALLINT,
    allowNull: true
  },
  rGoodTemperature: {
    type: Sequelize.SMALLINT,
    allowNull: true
  },
  rGoodCondition: {
    type: Sequelize.SMALLINT,
    allowNull: true
  },
  rState: {
    type: Sequelize.SMALLINT,
    allowNull: true
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
