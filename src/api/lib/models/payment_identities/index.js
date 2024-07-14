import Sequelize, { INTEGER, UUID } from 'sequelize'

import connect from '../../db'
// import { enCode } from '../../utils/util'
import util from '../../utils/util'

const conn = connect()

// conn.sync({ force: false })

export default conn.define('payment_identities', {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return util.enCode(this.getDataValue(x)) }
  },
  data: {
    type: Sequelize.JSONB,
    allowNull: false,
    unique: false
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  mailBody: {
    type: Sequelize.STRING(250),
    defaultValue: ''
  }
}, {
  timestamps: false
})
