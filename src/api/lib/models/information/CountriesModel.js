import { INTEGER, STRING, SMALLINT } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
const sequelize = connect()

export const MODEL_COUNTRIES_NAME = 'countries'

const CountriesModel = sequelize.define(MODEL_COUNTRIES_NAME, {
  cId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  cName: {
    type: STRING(100),
    allowNull: false
  },
  cCalCod: {
    type: STRING(10),
    allowNull: false
  },
  cState: {
    type: SMALLINT,
    allowNull: true,
    defaultValue: 1
  },
  cDatCre: {
    type: 'TIMESTAMP',
    defaultValue: new Date(),
    allowNull: true
  },
  cDatMod: {
    type: 'TIMESTAMP',
    defaultValue: new Date(),
    allowNull: true
  }
}, {
  timestamps: false
})

export default CountriesModel
