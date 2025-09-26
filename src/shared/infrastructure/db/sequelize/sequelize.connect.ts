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
 * Base path where persistent data is stored
 */
export const PATH_EXTERNAL_OS: string = String(process.env.PATH_EXTERNAL_OS)

/**
 * Flag to determine if SQLite is used
 */
export const useSQLITE: boolean = process.env.DIALECT_DB === 'sqlite'

/**
 * Sequelize instance (singleton)
 */
let sequelize: Sequelize | null = null

/**
 * Returns a safe writable path for storing persistent data.
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
 * Sequelize connection configuration
 */
const connectConfig: Options = useSQLITE
  ? {
      dialect: 'sqlite',
      storage: sqliteDatabasePath,
      logging: false,
      // schema solo aplica a Postgres, puedes quitarlo aquí
      dialectOptions: {
        useUTC: false
      }
    }
  : {
      host: process.env.HOST_DB,
      port: Number(process.env.PORT_DB),
      dialect: (process.env.DIALECT_DB as any) || 'postgres',
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
 * Initialize and return Sequelize instance
 * @returns {Sequelize} Singleton Sequelize instance
 */
export function connect(): Sequelize {
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
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Database connection error')
  }
}

export default connect
