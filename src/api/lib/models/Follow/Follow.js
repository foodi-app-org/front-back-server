import { INTEGER, SMALLINT, literal, STRING, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Users from '../UsersLogin/Users'

const sequelize = connect()

const FollowModel = sequelize.define('followmodel', {
  idFollower: {
    type: STRING(36),
    primaryKey: true,
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
    },
    unique: false

  },
  follow: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    },
    unique: false

  },
  fState: {
    type: SMALLINT,
    allowNull: false
  },
  DatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  DatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default FollowModel
