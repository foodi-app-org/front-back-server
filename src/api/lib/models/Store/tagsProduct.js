import Sequelize from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import { enCode } from '../../utils/util'

import Store from './Store'
import productModelFood from './../product/productFood'

const conn = connect()

export default conn.define('tagsproduct', {
  tPsId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  idStore: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  idUser: {
    type: Sequelize.INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  pId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productModelFood,
      key: 'pId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  nameTag: {
    type: Sequelize.STRING,
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
