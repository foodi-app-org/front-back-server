import { INTEGER, STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'

import Typefeature from './TypFeature'

const sequelize = connect()

export const FEATURE_MODEL = 'features'

const Feature = sequelize.define(FEATURE_MODEL, {
  fId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  thpId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Typefeature,
      key: 'thpId'
    }

  },
  hpqrQuestion: {
    type: STRING(120),
    allowNull: false
  },
  hpqrState: {
    type: SMALLINT,
    allowNull: false
  },
  hpqrDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },

  hpqrDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default Feature
