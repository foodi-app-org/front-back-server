import {
  INTEGER,
  STRING,
  DATE
  , JSONB
} from 'sequelize'

import connect from '../db'
import { enCode } from '../utils/util'

const sequelize = connect()

export const USER_MODEL = 'users'

const Users = sequelize.define(USER_MODEL, {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (value) { return enCode(this.getDataValue(value)) }
  },
  associateStore: {
    type: JSONB,
    allowNull: true,
    unique: false
  },
  name: {
    type: STRING,
    require: true
  },
  username: {
    type: STRING,
    require: true,
    trim: true,
    unique: false
  },
  lastName: {
    type: STRING,
    require: true,
    trim: true,
    unique: false
  },
  email: {
    type: STRING,
    require: true,
    trim: true,
    unique: true
  },
  avatar: {
    type: STRING,
    trim: true
  },
  // News
  uToken: {
    type: STRING(100),
    trim: true
  },
  uPhoNum: {
    type: STRING(50)
  },
  ULocation: {
    type: STRING(100)
  },
  upLat: {
    type: STRING(30)
  },
  uState: {
    type: INTEGER(30)
  },
  upLon: {
    type: STRING(30)
  },
  upIdeDoc: {
    type: STRING(50)
  },
  siteWeb: {
    type: STRING,
    trim: true
  },
  description: {
    type: STRING,
    trim: true
  },
  password: {
    type: STRING,
    trim: true,
    require: true
  },
  createAt: {
    type: DATE,
    default: Date.now(),
    defaultValue: Date.now()
  }
}, {
  freezeTableName: true, // Evita pluralizar el nombre de la tabla
  timestamps: true // Si no necesitas timestamps por defecto
})

export default Users
