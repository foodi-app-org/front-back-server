/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
// src/infrastructure/db/index.ts

import dotenv from 'dotenv'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Options, Sequelize } from 'sequelize'

dotenv.config({
  path: path.join(__dirname, '../../../../../.env')
})

/**
 * Ruta base donde se almacenan los datos persistentes
 */
export const PATH_EXTERNAL_OS = 'app_data'

/**
 * Flag para determinar si se usa SQLite
 */
export const useSQLITE: boolean = process.env.DIALECT_DB === 'sqlite'

let sequelize: Sequelize | null = null

/**
 * Devuelve una ruta de escritura segura para almacenar datos persistentes.
 * Evita usar __dirname si la app está empaquetada.
 */
function getWritablePath(): string {
  const basePath = path.join(os.homedir(), PATH_EXTERNAL_OS)
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true })
  }
  return basePath
}

const userDataPath: string = getWritablePath()
const sqliteDatabasePath: string = path.join(userDataPath, 'database.sqlite')

/**
 * Configuración de conexión para Sequelize
 */
const connectConfig: Options = useSQLITE
  ? {
    dialect: 'sqlite',
    storage: sqliteDatabasePath,
    logging: true,
    schema: 'public',
    dialectOptions: {
      useUTC: false
    }
  }
  : {
    host: process.env.HOST_DB,
    port: Number(process.env.PORT_DB),
    dialect: process.env.DIALECT_DB as any || 'postgres',
    logging: false,
    dialectOptions:
      process.env.USE_SSL_CONNECTION === 'true'
        ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
        : {}
  }

/**
 * Inicializa y retorna la instancia de Sequelize
 * @returns {Sequelize} Instancia singleton de Sequelize
 */
function connect(): Sequelize {
  try {
    if (sequelize) return sequelize

    if (useSQLITE) {
      console.info('🔗 Using SQLite database')
      console.info(`📁 DB Path: ${sqliteDatabasePath}`)
      sequelize = new Sequelize(connectConfig)
    } else {
      console.info('🔗 Using PostgreSQL database')
      sequelize = new Sequelize(
        process.env.NAME_DB || '',
        process.env.USER_DB || '',
        process.env.PASS_DB || '',
        connectConfig
      )
    }

    return sequelize
  } catch (error: any) {
    console.error('❌ Database connection error:', error.message)
    throw new Error(error)
  }
}

export default connect
