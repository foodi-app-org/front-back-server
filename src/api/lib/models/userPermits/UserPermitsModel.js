import { INTEGER, literal, STRING, UUIDV4 } from 'sequelize'

import connect from '../../db'
import SubModulesModel from '../subModules/SubModulesModel'
import Users from '../UsersLogin/Users'

const sequelize = connect()

const UserPermitsModel = sequelize.define('userpermits', {
  upId: {
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
  upState: {
    type: INTEGER,
    allowNull: false
  },
  upDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  upDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false,
  hooks: {
    afterBulkCreate: (model) => model
  }
})

export default UserPermitsModel
