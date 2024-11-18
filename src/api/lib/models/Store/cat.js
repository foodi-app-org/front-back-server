import {
  INTEGER,
  STRING,
  TEXT
  , UUIDV4
} from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import Store from '../Store/Store'

const sequelize = connect()

let productModelFood = null

export const CATEGORY_PRODUCT_MODEL = 'catproducts'

const catProducts = sequelize.define(
  CATEGORY_PRODUCT_MODEL,
  {
    carProId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    // id store
    idStore: {
      type: STRING(36),
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: Store,
        key: 'idStore'
      }
    },
    // User
    id: {
      type: STRING(36),
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: Users,
        key: 'id'
      }
    },
    pName: {
      type: STRING,
      allowNull: true
    },
    ProDescription: {
      type: TEXT,
      allowNull: true
    },
    pState: {
      type: INTEGER,
      allowNull: true
    },
    pDatCre: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: true
    },
    pDatMod: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: true
    }
  },
  {
    timestamps: false
  }
)

export default catProducts

import('../product/productFood').then((module) => {
  productModelFood = module.default
  catProducts.hasMany(productModelFood, {
    foreignKey: 'carProId',
    onDelete: 'CASCADE'
  })
})
