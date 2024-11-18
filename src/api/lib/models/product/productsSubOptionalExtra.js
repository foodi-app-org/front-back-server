import { INTEGER, STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Store from '../Store/Store'

import productModelFood from './productFood'
import productsOptionalExtra from './productsOptionalExtra'

const sequelize = connect()

export const PRODUCT_SUB_OPTIONAL_EXTRA = 'productssuboptionalextras'

const productsSubOptionalExtra = sequelize.define(PRODUCT_SUB_OPTIONAL_EXTRA, {
  opSubExPid: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
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
  opExPid: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productsOptionalExtra,
      key: 'opExPid'
    }

  },
  OptionalSubProName: {
    type: STRING,
    allowNull: false
  },
  exCodeOptionExtra: {
    type: STRING,
    allowNull: false
  },
  exCode: {
    type: STRING,
    allowNull: false
  },
  state: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1
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

export default productsSubOptionalExtra
