// models/productOptionalExtraSold.model.ts

import { DataTypes,STRING } from 'sequelize'

import connect from '../../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import {
  columnsProductExtra,
  SequelizeProductExtra
} from './sequelize-product-extra.model'

const sequelize = connect()


export const EXTRA_PRODUCT_MODEL_SOLD = 'products_extras_sold'

/**
 * Sequelize model definition for sold optional sub extras
 */
export class SequelizeProductExtraSold extends SequelizeProductExtra { 
  declare pCodeRef: string
}

export const columnsProductExtraSold = {
  ...columnsProductExtra,
  originalExPid: {
    type: STRING(36),
    primaryKey: false,
    autoIncrement: false,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    comment: 'Reference to the original optional extra product ID'
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
SequelizeProductExtraSold.init(columnsProductExtraSold, {
  sequelize,
  modelName: EXTRA_PRODUCT_MODEL_SOLD,
  freezeTableName: true,
  timestamps: false
})
