import { STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

const UsersLevelsModel = sequelize.define('userslevels', {
  ulId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  ulName: {
    type: STRING(100),
    allowNull: false
  },
  ulState: {
    type: SMALLINT,
    allowNull: false
  },
  uldDtCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  ulDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default UsersLevelsModel
