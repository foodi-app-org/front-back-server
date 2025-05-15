'use strict'

import path from 'path'
import fs from 'fs'
import os from 'os'

import Sequelize from 'sequelize'
import dotenv from 'dotenv'

import { LogDanger, LogInfo } from '../utils/logs'
require('sequelize/lib/sequelize')

// Configurar dotenv
dotenv.config({
  path: path.join(__dirname, '../../../../.env')
})

let sequelize = null

// Detectar si se ejecuta con SQLite
export const useSQLITE = process.env.DIALECT_DB === 'sqlite'

/**
 * Devuelve una ruta de escritura segura para almacenar datos persistentes
 * Evita usar __dirname si la app está empaquetada
 */
function getWritablePath () {
  const basePath = path.join(os.homedir(), 'app_data')

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true })
  }

  return basePath
}

const userDataPath = getWritablePath()
const sqliteDatabasePath = path.join(userDataPath, 'database.sqlite')

// Configuración de conexión para Sequelize
const connectConfig = useSQLITE
  ? {
    dialect: 'sqlite',
    storage: sqliteDatabasePath,
    logging: false,
    schema: 'public',
    dialectOptions: {
      useUTC: false
    }
  }
  : {
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    dialect: process.env.DIALECT_DB || 'postgres',
    dialectOptions:
        String(process.env.USE_SSL_CONNECTION) === 'true'
          ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
          : {},
    logging: false
  }

/**
 * Inicializa y retorna la instancia de Sequelize
 */
function connect () {
  try {
    if (sequelize) return sequelize

    if (useSQLITE) {
      LogInfo('🔗 Using SQLite database')
      LogInfo(`📁 DB Path: ${sqliteDatabasePath}`)
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
  } catch (error) {
    LogDanger(error.message)
    throw new Error(error)
  }

  return sequelize
}

export default connect
