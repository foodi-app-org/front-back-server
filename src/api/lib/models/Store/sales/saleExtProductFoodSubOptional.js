import { INTEGER, STRING, BOOLEAN, DATE, UUIDV4 } from 'sequelize'

import connect from '../../../db'

const sequelize = connect()

export const EXTRA_PRODUCT_FOOD_SUB_OPTIONAL = 'saleextproductfoodsuboptionals'

const ExtProductFoodSubOptional = sequelize.define(EXTRA_PRODUCT_FOOD_SUB_OPTIONAL, {
  idProductFoodSubOptional: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  extProductFoodId: {
    type: STRING(36),
    allowNull: true
  },
  pId: {
    type: STRING(36),
    allowNull: true
  },
  opExPid: {
    type: STRING(36),
    allowNull: false
  },
  pCodeRef: {
    type: STRING(100),
    unique: false,
    allowNull: true
  },
  idStore: {
    type: STRING(36),
    allowNull: true
  },
  opSubExPid: {
    type: STRING(36),
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
