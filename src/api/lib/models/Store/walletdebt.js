import Sequelize, { UUIDV4, STRING } from 'sequelize'

import connect from '../../db'
import Users from '../Users'

import Store from './Store'

const conn = connect()

export default conn.define('walletdebt', {
  debtWalletId: {
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
  UserDebtId: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }

  },
  debtName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ccWalletUser: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phoneWalletUser: {
    type: Sequelize.STRING,
    allowNull: false
  },
  personName: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  gender: {
    type: Sequelize.SMALLINT,
    allowNull: true,
    defaultValue: 1
  },
  RefDebtCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  debtAmount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  debtUuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  debtComments: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  debtState: {
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
