import { INTEGER, STRING, DATE, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

//

const trademarkModel = sequelize.define('trademark', {
  tId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  Name: {
    type: STRING(255),
    allowNull: false
  },
  Icon: {
    type: INTEGER,
    allowNull: false
  },
  DatCre: {
    type: DATE,
    default: Date.now()
  },
  DatMod: {
    type: DATE,
    allowNull: true
  }
}, {
  timestamps: false
})

export default trademarkModel
