import Sequelize from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'

const conn = connect()

const StorePendingToRegisterModel = conn.define('storesPending', {
  // ID único de la tienda pendiente
  StorePendingId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  // ID del usuario
  UserId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Email del usuario
  UserEmail: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  // Número de tienda
  StoreNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // Fecha y hora cuando el registro inició
  createAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  // Fecha y hora cuando se actualizó por última vez
  updateAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false
})

export default StorePendingToRegisterModel
