import { INTEGER, STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import UsersModel from '../users/UsersModel'

const sequelize = connect()
//

const FoldersModel = sequelize.define('folders', {
  fId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  uId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: UsersModel,
      key: 'uId'
    }
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
