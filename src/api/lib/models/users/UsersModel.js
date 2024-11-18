import { INTEGER, STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'

import UserMastersModel from './userMasterModel'

const sequelize = connect()

const UsersModel = sequelize.define('usersnot', {
  uId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  umId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: UserMastersModel,
      key: 'umId'
    }

  },
  uName: {
    type: STRING(100),
    allowNull: false
  },
  uLasNam: {
    type: STRING(100),
    allowNull: false
  },
  uPhone: {
    type: STRING(20),
    allowNull: false
  },
  uEmail: {
    type: STRING(100),
    allowNull: false,
    unique: true
  },
  uPassword: {
    type: STRING(100),
    allowNull: false
  },
  uToken: {
    type: STRING(100)
  },
  uState: {
    type: SMALLINT,
    allowNull: false
  },
  uDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  uDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default UsersModel
