import { STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const CATEGORY_PRODUCT = 'categorieproducts'

const CategoryProductsModel = sequelize.define(CATEGORY_PRODUCT, {
  caId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  cpName: {
    type: STRING(200),
    allowNull: false
  },
  cpImage: {
    type: STRING,
    trim: true,
    allowNull: true
  },
  cpState: {
    type: SMALLINT,
    allowNull: false
  },
  DatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  DatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default CategoryProductsModel
