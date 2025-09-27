// models/productOptionalExtraSold.model.ts

import { STRING, UUIDV4 } from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import {
  columnsProductOptionalExtra,
  SequelizeProductOptionalExtra
} from './sequelize-product-optional-extra.model'

const sequelize = connect()

export const PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL = 'products_optional_extras_sold'

/**
 * Sequelize model definition for sold optional extras
 */
export class SequelizeProductOptionalExtraSold extends SequelizeProductOptionalExtra {
}

export const columnsProductOptionalExtraSold = {
  ...columnsProductOptionalExtra,
  originalExtraId: {
    type: STRING(36),
    primaryKey: false,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false,
    comment: 'Reference to the original optional extra product'
  },
  pCodeRef: {
    type: STRING(100),
    unique: false,
    allowNull: false
  }
}
/**
 * Init model with same columns but different table
 */
SequelizeProductOptionalExtraSold.init(columnsProductOptionalExtraSold, {
  sequelize,
  modelName: PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL,
  freezeTableName: true,
  timestamps: false
})

export default SequelizeProductOptionalExtraSold
