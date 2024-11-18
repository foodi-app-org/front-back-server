import { INTEGER, STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import UsersModel from '../users/UsersModel'

const sequelize = connect()

//

const userSessionsModel = sequelize.define('usersessions', {
  usId: {
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
    },
    unique: true

  },
  usToken: {
    type: STRING(255),
    allowNull: false
  },
  usSessionID: {
    type: STRING(255),
    allowNull: false
  },
  usDevice: {
    type: STRING(255)
  },
  usIP: {
    type: STRING(255)
  },
  usState: {
    type: INTEGER,
    allowNull: false
  },
  createAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  updateAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: literal('CURRENT_TIMESTAMP')
  }

})

export default userSessionsModel
