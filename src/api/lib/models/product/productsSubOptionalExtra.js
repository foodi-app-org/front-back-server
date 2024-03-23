import { INTEGER, STRING, literal } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
import Store from '../Store/Store'

import productModelFood from './productFood'
import productsOptionalExtra from './productsOptionalExtra'

const sequelize = connect()

export const PRODUCT_SUB_OPTIONAL_EXTRA = 'productssuboptionalextras'

const productsSubOptionalExtra = sequelize.define(PRODUCT_SUB_OPTIONAL_EXTRA, {
  opSubExPid: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  pId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productModelFood,
      key: 'pId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  idStore: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  opExPid: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productsOptionalExtra,
      key: 'opExPid'
    },
    get (x) { return enCode(this.getDataValue(x)) }
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
