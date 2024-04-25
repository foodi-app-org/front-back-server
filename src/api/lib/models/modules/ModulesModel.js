import {
  INTEGER,
  STRING,
  literal
} from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'

const sequelize = connect()

export const MODULES_MODEL = 'modules'

const ModulesModel = sequelize.define(MODULES_MODEL, {
  mId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
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
