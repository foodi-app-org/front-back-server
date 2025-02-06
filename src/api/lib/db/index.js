'use strict'
import path from 'path'
import fs from 'fs'
import os from 'os'

import Sequelize from 'sequelize'
import dotenv from 'dotenv'

import { LogDanger, LogInfo } from '../utils/logs'

// Configurar dotenv
dotenv.config()

let sequelize = null

// Detectar si se ejecuta en modo empaquetado (pkg)
export const useSQLITE = process.env.DIALECT_DB === 'sqlite'

// Configuración de la ruta de la base de datos
const userDataPath = process.env.NODE_ENV === 'production'
  ? path.join(os.homedir(), 'app_data') // Cambia esto por la ruta que prefieras
  : __dirname

// Asegurarse de que el directorio de la base de datos exista
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true })
}

const sqliteDatabasePath = path.join(userDataPath, 'database.sqlite')

// Configuración de conexión
const connectConfig = useSQLITE
  ? {
    dialect: 'sqlite',
    storage: sqliteDatabasePath, // Usar la ruta fuera del paquete
    logging: false,
    schema: 'public'
  }
  : {
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    dialect: process.env.DIALECT_DB || 'postgres',
    dialectOptions: String(process.env.USE_SSL_CONNECTION) === 'true'
      ? {
        ssl: {
          require: true,
          rejectUnauthorized: false // Permitir certificados
        }
      }
      : {},
    logging: false
  }

function connect () {
  try {
    if (sequelize) return sequelize

    if (useSQLITE) {
      LogInfo('🔗 Using SQLite database')
      sequelize = new Sequelize(connectConfig)
    } else {
      LogInfo('🔗 Using PostgreSQL database')
      sequelize = new Sequelize(
        process.env.NAME_DB,
        process.env.USER_DB,
        process.env.PASS_DB,
        connectConfig
      )
    }

    if (useSQLITE) {
      // sequelize.sync() // Solo sincronizar en SQLite si es necesario
    }
  } catch (error) {
    LogDanger(error.message)
    throw new Error(error)
  }

  return sequelize
}

export default connect
