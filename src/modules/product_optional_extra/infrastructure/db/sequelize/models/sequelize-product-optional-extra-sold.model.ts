// models/productOptionalExtraSold.model.ts

import {
  SequelizeProductOptionalExtra,
  columnsProductOptionalExtra
} from './sequelize-product-optional-extra.model'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { STRING, UUIDV4 } from 'sequelize'

const sequelize = connect()

export const PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL = 'products_optional_extras_sold'

/**
 * Sequelize model definition for sold optional extras
 */
export class SequelizeProductOptionalExtraSold extends SequelizeProductOptionalExtra { }

export const columnsProductOptionalExtraSold = {
  ...columnsProductOptionalExtra,
  original_extra_id: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false,
    comment: 'Reference to the original optional extra product'
  },
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
