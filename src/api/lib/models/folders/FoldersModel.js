import { INTEGER, STRING, literal } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
import UsersModel from '../users/UsersModel'
const sequelize = connect()
//

const FoldersModel = sequelize.define('folders', {
  fId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  uId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: UsersModel,
      key: 'uId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  fName: {
    type: STRING(100),
    allowNull: false
  },
  fLevel: {
    type: INTEGER,
    allowNull: false
  },
  fState: {
    type: INTEGER,
    allowNull: false
  },
  fDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  fDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default FoldersModel
