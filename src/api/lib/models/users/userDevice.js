import {
  INTEGER,
  STRING,
  SMALLINT,
  literal,
  UUIDV4
} from 'sequelize'

import connect from '../../db'
import Users from '../Users'

const sequelize = connect()

export const USER_DEVICE_MODEL = 'userdevices'

const UserDeviceModel = sequelize.define(USER_DEVICE_MODEL, {
  dId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  id: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }

  },
  deviceId: {
    type: STRING(200),
    allowNull: false,
    unique: false
  },
  deviceName: {
    type: STRING(100),
    allowNull: false
  },
  type: {
    type: STRING(100),
    allowNull: true
  },
  short_name: {
    type: STRING(100),
    allowNull: true
  },
  locationFormat: {
    type: STRING(100),
    allowNull: true
  },
  platform: {
    type: STRING(100),
    allowNull: true
  },
  version: {
    type: STRING(100),
    allowNull: true
  },
  family: {
    type: STRING(100),
    allowNull: true
  },
  dState: {
    type: SMALLINT,
    allowNull: false
  },
  DatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  DatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default UserDeviceModel
