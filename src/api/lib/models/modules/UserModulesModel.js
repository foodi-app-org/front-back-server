import { INTEGER, literal } from 'sequelize'

import connect from '../../db'
import UsersModel from '../users/UsersModel'
import { enCode } from '../../utils/util'

import ModulesModel from './ModulesModel'

const sequelize = connect()

export const USER_MODULES_MODEL = 'usermodules'

const UserModulesModel = sequelize.define('usermodules', {
  umdId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  mId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: ModulesModel,
      key: 'mId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  umId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: UsersModel,
      key: 'umId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
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
