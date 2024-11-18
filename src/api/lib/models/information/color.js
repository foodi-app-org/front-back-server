import { STRING, SMALLINT, DATE, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const COLOR_MODEL = 'color'

const colorModel = sequelize.define(COLOR_MODEL, {
  colorId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
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
