import {
  STRING,
  TEXT,
  SMALLINT,
  literal
  , UUIDV4
} from 'sequelize'

import connect from '../../db'

import TypePQR from './TypPQR'

const sequelize = connect()

const PQR = sequelize.define('pqr', {
  hpqrId: {
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
      model: TypePQR,
      key: 'thpId'
    }
  },
  hpqrQuestion: {
    type: STRING(120),
    allowNull: false
  },

  hpqrAnswer: {
    type: TEXT,
    allowNull: false
  },

  hpqrState: {
    type: SMALLINT,
    allowNull: true,
    defaultValue: 1
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

export default PQR
