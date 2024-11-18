import Sequelize, { UUIDV4, STRING } from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import productModelFood from '../product/productFood'

import Store from './Store'

const conn = connect()

export default conn.define('walletdebtproducts', {
  debtWalletProductId: {
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
  pId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productModelFood,
      key: 'pId'
    }

  },
  UserDebtId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }

  },
  RefDebtCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  debtAmountProduct: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  debtComments: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  debtProductState: {
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
