import {
  DATE,
  SMALLINT,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const MODEL_CAT_STORE_NAME = 'category_stores'

sequelize.sync()

const CatStore = sequelize.define(MODEL_CAT_STORE_NAME, {
  catStore: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  cName: {
    type: STRING(100),
    allowNull: false
  },
  csDescription: {
    type: STRING,
    allowNull: false
  },
  cState: {
    type: SMALLINT,
    defaultValue: 1
  },
  cPathImage: {
    type: STRING
  },
  cDatCre: {
    type: DATE,
    default: Date.now()
  },
  cDatMod: {
    type: DATE,
    default: Date.now()
  }
}, {
  timestamps: false
})

export default CatStore
