// models/productOptionalExtraSold.model.ts

import {
  SequelizeProductSubOptionalExtra,
  columnsProductSubOptionalExtra
} from './sequelize-product-sub-optional-extra.model'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { STRING, UUIDV4 } from 'sequelize'

const sequelize = connect()

export const PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL = 'products_sub_optional_extras_sold'

/**
 * Sequelize model definition for sold optional sub extras
 */
export class SequelizeProductSubOptionalExtraSold extends SequelizeProductSubOptionalExtra { }

export const columnsProductSubOptionalExtraSold = {
  ...columnsProductSubOptionalExtra,
  optionalSubExtraId: {
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
SequelizeProductSubOptionalExtraSold.init(columnsProductSubOptionalExtraSold, {
  sequelize,
  modelName: PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL,
  freezeTableName: true,
  timestamps: false
})

export default SequelizeProductSubOptionalExtraSold
