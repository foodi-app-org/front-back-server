import { INTEGER, STRING, DATE, UUIDV4 } from 'sequelize'

import connect from '../../../db'
import productModelFood from '../../product/productFood'

import productsOptionalExtra from './../../product/productsOptionalExtra'

const sequelize = connect()

export const EXTRA_PRODUCT_FOOD_OPTIONAL = 'saleextproductfoodoptionals'

const ExtProductFoodOptional = sequelize.define(EXTRA_PRODUCT_FOOD_OPTIONAL, {
  idSaleProductOptional: {
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
  pCodeRef: {
    type: STRING(100),
    unique: false,
    allowNull: true
  },
  refCodePid: {
    type: STRING(50),
    allowNull: true
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
  OptionalProName: {
    type: STRING,
    allowNull: true
  },
  state: {
    type: INTEGER,
    allowNull: true
  },
  code: {
    type: STRING,
    allowNull: true
  },
  numbersOptionalOnly: {
    type: INTEGER,
    allowNull: true
  },
  pDatCre: {
    type: DATE,
    allowNull: true
  },
  required: {
    type: INTEGER,
    allowNull: true
  },
  pDatMod: {
    type: DATE,
    allowNull: true
  }
})

export default ExtProductFoodOptional
