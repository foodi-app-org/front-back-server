import {
  STRING,
  SMALLINT
  , UUIDV4
} from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const MODEL_CITIES_NAME = 'cities'

const CitiesModel = sequelize.define(MODEL_CITIES_NAME, {
  ctId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  dId: {
    type: STRING(36),
    allowNull: false
  },
  cName: {
    type: STRING(100),
    allowNull: false
  },
  code_ctId: {
    type: STRING(100),
    allowNull: false
  },
  cState: {
    type: SMALLINT,
    allowNull: false
  },
  cDatCre: {
    type: 'TIMESTAMP',
    defaultValue: new Date(),
    allowNull: false
  },
  cDatMod: {
    type: 'TIMESTAMP',
    defaultValue: new Date(),
    allowNull: false
  }
}, {
  timestamps: false
})

export default CitiesModel
