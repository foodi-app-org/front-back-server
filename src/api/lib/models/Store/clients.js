import Sequelize, { STRING, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import Store from './Store'

const conn = connect()

export const CLIENTS_MODEL = 'clients'

export default conn.define(CLIENTS_MODEL, {
  cliId: {
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
  idUser: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }
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
