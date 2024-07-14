'use strict'
import Sequelize from 'sequelize'
import dotenv from 'dotenv'

// Configura dotenv
dotenv.config()

let sequelize = null
const dialectOptions = process.env.NODE_ENV === 'development'
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

function connect() {
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
  } catch (error) {
    console.log(error.message)
    throw new Error(error)
  }
  return sequelize
}

export default connect
