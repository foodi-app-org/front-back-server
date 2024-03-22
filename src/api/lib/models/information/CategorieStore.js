import {
  INTEGER,
  STRING,
  SMALLINT,
  DATE
} from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
const sequelize = connect()

export const MODEL_CAT_STORE_NAME = 'catstores'

const CatStore = sequelize.define(MODEL_CAT_STORE_NAME, {
  catStore: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
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
