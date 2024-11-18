import { STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

const UserMastersModel = sequelize.define('usermasters', {
  umId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  umIdAWS: {
    type: STRING(200),
    allowNull: false,
    unique: true
  },
  umDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  umDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default UserMastersModel
