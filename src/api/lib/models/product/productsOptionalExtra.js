import {
  INTEGER,
  STRING,
  literal,
  UUIDV4
} from 'sequelize'

import connect from '../../db'
import Store from '../Store/Store'

import productModelFood from './productFood'

const sequelize = connect()

export const PRODUCT_OPTIONAL_EXTRA_MODEL = 'productsoptionalextras'

const productsOptionalExtra = sequelize.define(PRODUCT_OPTIONAL_EXTRA_MODEL, {
  opExPid: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  pId: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productModelFood,
      key: 'pId'
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
  OptionalProName: {
    type: STRING,
    allowNull: false
  },
  code: {
    type: STRING,
    allowNull: true
  },
  numbersOptionalOnly: {
    type: INTEGER(20),
    allowNull: true
  },
  state: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  required: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  pDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  pDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default productsOptionalExtra
