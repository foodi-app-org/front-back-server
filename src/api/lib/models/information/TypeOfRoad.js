import { STRING, SMALLINT, DATE, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

//
export const MODEL_TYPEROAD_NAME = 'typeroad'

const TypeRoad = sequelize.define(MODEL_TYPEROAD_NAME, {
  rId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
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
