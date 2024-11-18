import { STRING, SMALLINT, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const MODEL_COUNTRIES_NAME = 'countries'

const CountriesModel = sequelize.define(MODEL_COUNTRIES_NAME, {
  cId: {
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
