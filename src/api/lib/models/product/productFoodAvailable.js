import { INTEGER, literal } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
import Store from '../Store/Store'

import productModelFood from './productFood'

const sequelize = connect()

export const PRODUCT_FOOD_AVAILABLE = 'productmodelfoodavailables'

const productModelFoodAvailable = sequelize.define(PRODUCT_FOOD_AVAILABLE, {
  availableProductId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  // id store
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

  pId: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productModelFood,
      key: 'pId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  dayAvailable: {
    type: INTEGER,
    allowNull: true
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

export default productModelFoodAvailable
