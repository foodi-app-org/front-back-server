import { INTEGER, STRING, BOOLEAN, DATE } from 'sequelize'

import connect from '../../../db'
import { enCode } from '../../../utils/util'
const sequelize = connect()

export const EXTRA_PRODUCT_FOOD_SUB_OPTIONAL = 'saleextproductfoodsuboptionals'

const ExtProductFoodSubOptional = sequelize.define(EXTRA_PRODUCT_FOOD_SUB_OPTIONAL, {
  idProductFoodSubOptional: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  extProductFoodId: {
    type: INTEGER,
    allowNull: true
  },
  pId: {
    type: INTEGER,
    allowNull: true
  },
  opExPid: {
    type: INTEGER,
    allowNull: false
  },
  pCodeRef: {
    type: STRING(100),
    unique: false,
    allowNull: true
  },
  idStore: {
    type: INTEGER,
    allowNull: true
  },
  opSubExPid: {
    type: INTEGER,
    allowNull: true
  },
  OptionalSubProName: {
    type: STRING,
    allowNull: false
  },
  exCodeOptionExtra: {
    type: STRING,
    allowNull: false
  },
  exCode: {
    type: STRING,
    allowNull: false
  },
  state: {
    type: INTEGER,
    allowNull: false
  },
  pDatCre: {
    type: DATE,
    allowNull: true
  },
  pDatMod: {
    type: DATE,
    allowNull: true
  },
  check: {
    type: BOOLEAN,
    allowNull: true
  }
})

export default ExtProductFoodSubOptional
