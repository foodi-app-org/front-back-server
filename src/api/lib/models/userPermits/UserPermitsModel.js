import { INTEGER, literal } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
import SubModulesModel from '../subModules/SubModulesModel'
import Users from '../UsersLogin/Users'
const sequelize = connect()

const UserPermitsModel = sequelize.define('userpermits', {
  upId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  id: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  smId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: SubModulesModel,
      key: 'smId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
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
