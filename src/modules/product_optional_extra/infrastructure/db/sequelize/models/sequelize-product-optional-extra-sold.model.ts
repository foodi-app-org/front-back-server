// models/productOptionalExtraSold.model.ts

import { DataTypes, STRING, UUIDV4 } from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import {
  columnsProductOptionalExtra,
  SequelizeProductOptionalExtra
} from './sequelize-product-optional-extra.model'
import { PRODUCT_MODEL_SOLD, SequelizeProductSold } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product-sold.model'
import { ASSOCIATION_PRODUCTS_NAME } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product.model'

const sequelize = connect()

export const PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL = 'products_optional_extras_sold'
export const ASSOCIATION_PRODUCT_OPTIONAL_EXTRA_SOLD_NAME = 'dataExtraOptional'
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
  },
  pId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: PRODUCT_MODEL_SOLD,
      key: 'pId',
    }
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

// Establish associations between sold products and sold optional extras
// SequelizeProductSold.hasMany(SequelizeProductOptionalExtraSold, {
//   as: 'dataOptional',
//   foreignKey: 'pId',
//   sourceKey: 'pId'
// })

SequelizeProductOptionalExtraSold.belongsTo(SequelizeProductSold, {
  as: ASSOCIATION_PRODUCTS_NAME,
  foreignKey: 'pId',
  targetKey: 'pId'
})


export default SequelizeProductOptionalExtraSold
