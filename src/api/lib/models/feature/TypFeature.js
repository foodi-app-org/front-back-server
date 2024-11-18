import { STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const TYPE_FEATURE_MODEL = 'typefeatures'

const Typefeature = sequelize.define(TYPE_FEATURE_MODEL, {
  thpId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  thpName: {
    type: STRING(100),
    allowNull: false
  },
  thpIcon: {
    type: SMALLINT,
    allowNull: true,
    defaultValue: 1
  },
  thpState: {
    type: SMALLINT,
    allowNull: true,
    defaultValue: 1
  },
  thpDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  thpDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default Typefeature
