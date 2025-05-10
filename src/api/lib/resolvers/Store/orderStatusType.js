// models/OrderStatusType.ts
import { SMALLINT, STRING, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const STATUS_TYPE_MODEL = 'orderStatusTypes'

const OrderStatusTypeModel = sequelize.define(STATUS_TYPE_MODEL, {
  idStatusType: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING(50), // Ej: "ACCEPTED", "READY"
    allowNull: false
  },
  label: {
    type: STRING(50), // Ej: "Aceptado", "Listo"
    allowNull: false
  },
  description: {
    type: STRING(255), // Ej: "Pedido aceptado", "Pedido listo"
    allowNull: false
  },
  sOState: {
    type: SMALLINT,
    defaultValue: 1 // 1: Activo, 0: Inactivo
  }
}, {
  timestamps: true
})

export default OrderStatusTypeModel
