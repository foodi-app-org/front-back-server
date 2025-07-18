import Sequelize, { STRING, UUIDV4 } from 'sequelize'

import connect from '../../db'

const conn = connect()

export const TAGS_PRODUCT_MODEL_NAME = 'tagsproducts'

export default conn.define(TAGS_PRODUCT_MODEL_NAME, {
  tgId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  idStore: {
    type: STRING(36),
    allowNull: true
  },
  idUser: {
    type: STRING(36),
    allowNull: true
  },
  nameTag: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  createdAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false
})
