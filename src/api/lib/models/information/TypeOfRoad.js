import { INTEGER, STRING, SMALLINT, DATE } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
const sequelize = connect()

//
export const MODEL_TYPEROAD_NAME = 'typeroad'

const TypeRoad = sequelize.define(MODEL_TYPEROAD_NAME, {
  rId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  rName: {
    type: STRING(100),
    allowNull: false
  },
  rState: {
    type: SMALLINT,
    defaultValue: 1
  },
  rDatCre: {
    type: DATE,
    default: Date.now()
  },
  rDatMod: {
    type: DATE,
    default: Date.now()
  }
}, {
  timestamps: false
})

export default TypeRoad
