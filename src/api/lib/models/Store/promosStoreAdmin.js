import Sequelize, { UUIDV4, STRING } from 'sequelize'

import connect from '../../db'

const conn = connect()
export default conn.define('promodashboardstoreadmins', {
  pSoId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  comments: {
    type: Sequelize.STRING,
    allowNull: false
  },
  metaTags: {
    type: Sequelize.STRING,
    allowNull: true
  },
  urlImage: {
    type: Sequelize.STRING,
    allowNull: true
  },
  mainName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bPromoState: {
    type: Sequelize.SMALLINT,
    allowNull: false,
    defaultValue: 1
  },
  createAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updateAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false
})
