import {
  INTEGER,
  STRING,
  literal,
  DECIMAL
  , UUIDV4
} from 'sequelize'

import connect from '../../db'
import Store from '../Store/Store'

import productModelFood from './productFood'

const sequelize = connect()

export const EXTRA_PRODUCT_MODEL = 'products_extras'

const ExtraProductModel = sequelize.define(EXTRA_PRODUCT_MODEL, {
  exPid: {
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
  exState: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  extraName: {
    type: STRING,
    allowNull: false
  },
  extraPrice: {
    type: DECIMAL(1000, 2),
    allowNull: true
  },
  // state
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

export default ExtraProductModel
