import { INTEGER, literal, UUIDV4, STRING } from 'sequelize'

import connect from '../../db'
import UsersModel from '../users/UsersModel'

import ModulesModel from './ModulesModel'

const sequelize = connect()

export const USER_MODULES_MODEL = 'usermodules'

const UserModulesModel = sequelize.define('usermodules', {
  umdId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  mId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: ModulesModel,
      key: 'mId'
    }

  },
  umId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: UsersModel,
      key: 'umId'
    }
  },
  umdState: {
    type: INTEGER,
    allowNull: false
  },
  umdPriority: {
    type: INTEGER,
    allowNull: false
  },
  umdDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  umdDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default UserModulesModel
