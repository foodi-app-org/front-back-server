import {
  STRING,
  SMALLINT,
  DATE
  , UUIDV4
} from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const SIZE_MODEL = 'sizes'

const SizeModel = sequelize.define(SIZE_MODEL, {
  sizeId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
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
