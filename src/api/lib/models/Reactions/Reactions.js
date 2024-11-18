import { INTEGER, STRING, UUID, UUIDV4, literal } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

const ReactionsModel = sequelize.define('reactions', {
  id: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
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
  messageId: {
    type: INTEGER,
    allowNull: false
  },
  userId: {
    type: STRING(36),
    allowNull: false
  },
  rDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  rDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default ReactionsModel
