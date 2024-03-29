import Sequelize from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import { enCode } from '../../utils/util'

import Store from './Store'

const conn = connect()

export const CLIENTS_MODEL = 'clients'

export default conn.define(CLIENTS_MODEL, {
  cliId: {
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
  clState: {
    type: Sequelize.SMALLINT,
    allowNull: true,
    defaultValue: 1
  },
  gender: {
    type: Sequelize.SMALLINT(2),
    allowNull: true,
    defaultValue: 1
  },
  ClientAddress: {
    type: Sequelize.STRING
  },
  clientNumber: {
    type: Sequelize.STRING,
    allowNull: true
  },
  clientName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  clientLastName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  ccClient: {
    type: Sequelize.STRING,
    unique: true,
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
