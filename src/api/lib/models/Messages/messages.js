import { STRING, UUID, UUIDV4, literal } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

const MessagesModel = sequelize.define('messages', {
  id: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  content: {
    type: STRING,
    allowNull: false
  },
  uuid: {
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false
  },
  from: {
    type: STRING,
    allowNull: false
  },
  to: {
    type: STRING,
    allowNull: false
  },
  aDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  aDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default MessagesModel
