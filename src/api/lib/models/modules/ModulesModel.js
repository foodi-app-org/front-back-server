import {
  INTEGER,
  STRING,
  literal
  , UUIDV4
} from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const MODULES_MODEL = 'modules'

const ModulesModel = sequelize.define(MODULES_MODEL, {
  mId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  mName: {
    type: STRING,
    allowNull: false
  },
  mPath: {
    type: STRING,
    allowNull: false
  },
  mPriority: {
    type: INTEGER,
    allowNull: false
  },
  mIcon: {
    type: INTEGER,
    allowNull: false
  },
  mState: {
    type: INTEGER,
    allowNull: false
  },
  mDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  mDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default ModulesModel
