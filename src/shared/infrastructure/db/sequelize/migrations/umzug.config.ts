import { register } from 'ts-node'


register({
  transpileOnly: true,
})

import glob from 'fast-glob'
import path from 'path'
import { QueryInterface, STRING } from 'sequelize'
import { SequelizeStorage, Umzug } from 'umzug'
import { ConsoleLogger } from '../../../logger/console.logger'

import connect from '../sequelize.connect'

const sequelize = connect()

export enum MigrationFolder {
  Tenanted = 'tenanted',
  Public = 'public',
  Private = 'private',
  Empty = ''
}

export enum MigrationType {
  All = 'all',
  DDL = 'ddl',
  DML = 'dml',
  PUBLIC = 'public',
}

/**
 * Get migration paths for all modules by type (ddl or dml).
 *
 * @param type - Migration type: 'ddl' | 'dml' | 'public'
 * @returns {Promise<string[]>} List of absolute migration paths
 */
export const getMigrationPaths = async (type: MigrationType): Promise<string[]> => {
  const normalize = (p: string) => p.replace(/\\/g, '/')
  const resolvePattern = (segment: string) =>
    path.resolve(__dirname, `../../../../../modules/**/infrastructure/db/sequelize/migrations/${segment}/*.ts`)

  if (type === MigrationType.All) {
    // concat DDL + DML
    const [ddl, dml] = await Promise.all([
      getMigrationPaths(MigrationType.DDL),
      getMigrationPaths(MigrationType.DML),
    ])
    return [...ddl, ...dml]
  }

  if (type === MigrationType.PUBLIC) {
    // public/ddl + public/dml
    const patterns = [
      resolvePattern(`${MigrationType.PUBLIC}/${MigrationType.DDL}`),
      resolvePattern(`${MigrationType.PUBLIC}/${MigrationType.DML}`),
    ].map(normalize)

    const results = await Promise.all(patterns.map(p => glob(p)))
    return results.flat()
  }

  // DDL or DML (u otros tipos futuros)
  return glob(normalize(resolvePattern(type)))
}

/**
 * Builds a configured Umzug migrator for a given schema and migration type (DDL or DML).
 *
 * @param {string} schemaName - The DB schema to apply migrations on.
 * @param {MigrationType} type - Migration type: ddl | dml.
 * @returns {Promise<Umzug<QueryInterface>>} - Configured Umzug instance.
 */
export const createUmzugMigrator = async (
  schemaName: MigrationFolder = MigrationFolder.Public,
  type: MigrationType = MigrationType.All,
  customMigrationFiles: string[] = []
): Promise<Umzug<QueryInterface>> => {
  const logger = new ConsoleLogger()
  logger.info(`Creating Umzug migrator for schema: ${schemaName}, type: ${type}`)
  // Get all migration paths
  const allMigrations = await getMigrationPaths(MigrationType.All)
  console.log("🚀 ~ createUmzugMigrator ~ allMigrations:", allMigrations)

  const migrationFiles = customMigrationFiles.length > 0
    ? customMigrationFiles
    : allMigrations
  logger.info(`Found ${migrationFiles.length} migration files.`)

  if (migrationFiles.length === 0) {
    logger.warn('No migration files found. Ensure the glob patterns are correct.')
    throw new Error('No migration files found.')
  }



  // Define a tracking model per schema + type
  const model = sequelize.define(
    `MigrationsMeta_${type}`,
    {
      name: {
        type: STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      }
    },
    {
      schema: schemaName,
      modelName: `migrations_meta_${type}`,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  )


  return new Umzug<QueryInterface>({
    migrations: migrationFiles.map(file => {
      const migration = require(file)
      return {
        name: path.basename(file, '.ts'),
        up: async ({ context }: { context: QueryInterface }) =>
          migration.up(context, schemaName),
        down: async ({ context }: { context: QueryInterface }) =>
          migration.down(context, schemaName),
      }
    }),
    context: sequelize.getQueryInterface(), // ahora sí es el QueryInterface real
    storage: new SequelizeStorage({ model }),
    logger: console,
  })

}

/**
 * Runs DDL migrations first, then DML migrations.
 *
 * @param {MigrationFolder} schemaName - The schema where migrations are applied.
 */
export const runMigrations = async (
  schemaName: MigrationFolder = MigrationFolder.Public
): Promise<void> => {
  console.log('🚀 Running DDL migrations...')
  const ddlMigrator = await createUmzugMigrator(schemaName, MigrationType.DDL)
  await ddlMigrator.up()

  console.log('🚀 Running DML migrations...')
  const dmlMigrator = await createUmzugMigrator(schemaName, MigrationType.DML)
  await dmlMigrator.up()

  console.log('✅ All migrations completed successfully!')
}
