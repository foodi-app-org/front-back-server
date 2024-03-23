import {
  INTEGER,
  STRING,
  TEXT
} from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
import Users from '../Users'
import Store from '../Store/Store'

const sequelize = connect()

let productModelFood = null

export const CATEGORY_PRODUCT_MODEL = 'catproducts'

const catProducts = sequelize.define(
  CATEGORY_PRODUCT_MODEL,
  {
    carProId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      get (x) {
        return enCode(this.getDataValue(x))
      }
    },
    // id store
    idStore: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: Store,
        key: 'idStore'
      },
      get (x) {
        return enCode(this.getDataValue(x))
      }
    },
    // User
    id: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: Users,
        key: 'id'
      },
      get (x) {
        return enCode(this.getDataValue(x))
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
