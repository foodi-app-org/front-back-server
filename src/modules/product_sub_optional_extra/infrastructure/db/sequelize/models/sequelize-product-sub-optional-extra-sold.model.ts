// models/productOptionalExtraSold.model.ts

import { STRING, UUIDV4 } from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { columnsProductSubOptionalExtra, SequelizeProductSubOptionalExtra } from './sequelize-product-sub-optional-extra.model'
import SequelizeProductOptionalExtraSold, { PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL } from '@modules/product_optional_extra/infrastructure/db/sequelize/models/sequelize-product-optional-extra-sold.model'

const sequelize = connect()

export const PRODUCT_SUB_OPTIONAL_EXTRA_SOLD_MODEL = 'products_sub_optional_extras_sold'

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
  },
  opExPid: {
    type: STRING(36),
    allowNull: true,
    references: {
      model: PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL,
      key: 'opExPid'
    }
  },
}
/**
 * Init model with same columns but different table
 */
SequelizeProductSubOptionalExtraSold.init(columnsProductSubOptionalExtraSold, {
  sequelize,
  modelName: PRODUCT_SUB_OPTIONAL_EXTRA_SOLD_MODEL,
  freezeTableName: true,
  timestamps: false
})

// OPTIONAL EXTRA SOLD → MANY SUB OPTIONAL EXTRAS SOLD
SequelizeProductOptionalExtraSold.hasMany(SequelizeProductSubOptionalExtraSold, {
  as: 'ExtProductFoodsSubOptionalAll',
  foreignKey: 'opExPid',
  sourceKey: 'opExPid',
  onDelete: 'CASCADE'
});

SequelizeProductSubOptionalExtraSold.belongsTo(SequelizeProductOptionalExtraSold, {
  as: 'optionalExtra',
  foreignKey: 'opExPid',
  targetKey: 'opExPid'
});

export default SequelizeProductSubOptionalExtraSold
