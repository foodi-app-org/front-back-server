import { INTEGER, STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Store from '../Store/Store'
import Users from '../Users'

const sequelize = connect()

const dynamicPassword = sequelize.define('dynamicpassword', {
  dPassId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  id: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }

  },
  idStore: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    }

  },
  deviceId: {
    type: STRING(200),
    allowNull: false,
    unique: true
  },
  keyPassDynamic: {
    type: INTEGER(4),
    allowNull: false,
    unique: false
  },
  deviceName: {
    type: STRING(100),
    allowNull: false
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

export default dynamicPassword
