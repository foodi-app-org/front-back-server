import { INTEGER, literal, STRING, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Store from '../Store/Store'

import productModelFood from './productFood'

const sequelize = connect()

export const PRODUCT_FOOD_AVAILABLE = 'productmodelfoodavailables'

const productModelFoodAvailable = sequelize.define(PRODUCT_FOOD_AVAILABLE, {
  availableProductId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  // id store
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
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productModelFood,
      key: 'pId'
    }

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
