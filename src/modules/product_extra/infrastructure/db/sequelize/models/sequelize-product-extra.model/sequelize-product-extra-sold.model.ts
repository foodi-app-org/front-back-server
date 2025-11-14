// models/productOptionalExtraSold.model.ts

import { DataTypes, STRING } from 'sequelize'

import connect from '../../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import {
  columnsProductExtra,
  SequelizeProductExtra
} from './sequelize-product-extra.model'
import { PRODUCT_MODEL_SOLD } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product-sold.model'

const sequelize = connect()


export const EXTRA_PRODUCT_MODEL_SOLD = 'products_extras_sold'

/**
 * Sequelize model definition for sold optional sub extras
 */
export class SequelizeProductExtraSold extends SequelizeProductExtra {
  declare pCodeRef: string
  declare quantity: number
  declare originalExPid: string
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
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
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
SequelizeProductExtraSold.init(columnsProductExtraSold, {
  sequelize,
  modelName: EXTRA_PRODUCT_MODEL_SOLD,
  freezeTableName: true,
  timestamps: false
})