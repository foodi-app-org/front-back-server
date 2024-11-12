'use strict'
import Sequelize from 'sequelize'
import dotenv from 'dotenv'

import { LogDanger } from '../utils/logs'

// Configura dotenv
dotenv.config()

let sequelize = null
const dialectOptions = String(process.env.USE_SSL_CONNECTION) === 'true'
  ? {
    postgres: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Permitir certificados autofirmados
      }
    }
  }
  : {}

export const connectConfig = {
  host: process.env.HOST_DB,
  port: process.env.PORT_DB,
  dialect: process.env.DIALECT_DB,
  dialectOptions: dialectOptions[process.env.DIALECT_DB] || {}
}

function connect () {
  try {
    if (sequelize) return sequelize
    sequelize = new Sequelize(
      process.env.NAME_DB, // name of the database
      process.env.USER_DB, // name of the user database
      process.env.PASS_DB, // password of the database
      {
        ...connectConfig
      }
    )
    process.env.USE_SSL_CONNECTION === 'true' && sequelize.sync({})
  } catch (error) {
    LogDanger(error.message)
    throw new Error(error)
  }
  return sequelize
}

export default connect
