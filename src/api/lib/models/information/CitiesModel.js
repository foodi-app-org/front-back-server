import {
  INTEGER,
  STRING,
  SMALLINT
} from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'

import DepartmentsModel from './DepartmentsModel'
const sequelize = connect()

export const MODEL_CITIES_NAME = 'cities'

const CitiesModel = sequelize.define(MODEL_CITIES_NAME, {
  ctId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  dId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: DepartmentsModel,
      key: 'dId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  cName: {
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
