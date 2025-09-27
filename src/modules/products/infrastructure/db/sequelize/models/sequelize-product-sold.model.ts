// models/productOptionalExtraSold.model.ts

import { DataTypes,STRING } from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import {
  columnsProduct,
  SequelizeProductModel
} from './sequelize-product.model'

const sequelize = connect()

export const PRODUCT_MODEL_SOLD = 'product_models_sold'

/**
 * Sequelize model definition for sold optional sub extras
 */
export class SequelizeProductSold extends SequelizeProductModel { 
  declare pCodeRef: string
}

export const columnsProductSold = {
  ...columnsProduct,
  optionalProductId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    comment: 'Reference to the original optional extra product ID'
  },
  pCodeRef: {
    type: STRING(100),
    unique: false,
    allowNull: false
  },
  pId: {
    type: STRING(100),
    unique: false,
    allowNull: false
  }
}
/**
 * Init model with same columns but different table
 */
SequelizeProductSold.init(columnsProductSold, {
  sequelize,
  modelName: PRODUCT_MODEL_SOLD,
  freezeTableName: true,
  timestamps: false
})
