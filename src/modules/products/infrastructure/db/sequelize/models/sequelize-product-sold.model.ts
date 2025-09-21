// models/productOptionalExtraSold.model.ts

import {
  SequelizeProductModel,
  columnsProduct
} from './sequelize-product.model'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { STRING, UUIDV4 } from 'sequelize'

const sequelize = connect()

export const PRODUCT_MODEL_SOLD = 'product_models_sold'

/**
 * Sequelize model definition for sold optional sub extras
 */
export class SequelizeProductSubOptionalExtraSold extends SequelizeProductModel { }

export const columnsProductSold = {
  ...columnsProduct,
  optional_product_id: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false,
    comment: 'Reference to the original optional extra product ID'
  },
}
/**
 * Init model with same columns but different table
 */
SequelizeProductSubOptionalExtraSold.init(columnsProductSubOptionalExtraSold, {
  sequelize,
  modelName: PRODUCT_MODEL_SOLD,
  freezeTableName: true,
  timestamps: false
})

export default SequelizeProductSubOptionalExtraSold
