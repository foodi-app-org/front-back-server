import { INTEGER, literal, UUIDV4, STRING } from 'sequelize'

import connect from '../../db'
import UserModulesModel from '../modules/UserModulesModel'

import SubModulesModel from './SubModulesModel'

const sequelize = connect()

/**
 * @deprecated
 */
const UserSubModulesModel = sequelize.define('usersubmodules', {
  usmId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  umdId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: UserModulesModel,
      key: 'umdId'
    }

  },
  smId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: SubModulesModel,
      key: 'smId'
    }

  },
  usmPriority: {
    type: INTEGER,
    allowNull: false
  },
  usmState: {
    type: INTEGER,
    allowNull: false
  },
  usmDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  usmDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default UserSubModulesModel
