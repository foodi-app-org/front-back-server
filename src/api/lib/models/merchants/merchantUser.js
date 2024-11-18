import { UUID, UUIDV4 } from 'sequelize'

import connect from '../../db'

const conn = connect()

export default conn.define('merchant_users', {
  idMU: {
    type: UUID,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: UUIDV4
  }
}, {
  timestamps: false
})
