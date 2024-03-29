import { INTEGER, STRING, SMALLINT, DATE } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'

const sequelize = connect()

export const COLOR_MODEL = 'color'

const colorModel = sequelize.define(COLOR_MODEL, {
  colorId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
  },
  colorName: {
    type: STRING(255),
    allowNull: false
  },
  // CAMBIO DE ESTADO PARA BORRAR EL PRODUCTO
  colorState: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: 1
  },
  colorDatCre: {
    type: DATE,
    default: Date.now()
  },
  colorDatMod: {
    type: DATE,
    allowNull: true
  }
}, {
  timestamps: false
})

export default colorModel
