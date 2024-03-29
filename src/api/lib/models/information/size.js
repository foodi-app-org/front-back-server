import {
  INTEGER,
  STRING,
  SMALLINT,
  DATE
} from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'

const sequelize = connect()

export const SIZE_MODEL = 'sizes'

const SizeModel = sequelize.define(SIZE_MODEL, {
  sizeId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  sizeName: {
    type: STRING(100),
    allowNull: false
  },
  sizeState: {
    type: SMALLINT,
    defaultValue: 1,
    allowNull: true
  },
  DatCre: {
    type: DATE,
    default: Date.now()
  },
  DatMod: {
    type: DATE,
    default: Date.now()
  }
}, {
  timestamps: false
})

export default SizeModel
