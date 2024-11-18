import { STRING, SMALLINT, DATE, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

const TypeIdentitiesModel = sequelize.define('typeidentities', {
  tiId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  tiName: {
    type: STRING(100),
    allowNull: false
  },
  tiState: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: 1
  },
  tiDatCre: {
    type: DATE,
    default: Date.now()
  },
  tiDatMod: {
    type: DATE,
    default: Date.now()
  }
}, {
  timestamps: false
})

export default TypeIdentitiesModel
