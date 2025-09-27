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
  DML = 'dml'
}

/**
 * Get migration paths for all modules by type (ddl or dml).
 *
 * @param type - Migration type: 'ddl' | 'dml'
 * @returns {Promise<string[]>} List of absolute migration paths
 */
const getMigrationPaths = async (type: MigrationType): Promise<string[]> => {
  const pattern = path.resolve(
    __dirname,
    `../../../../../modules/**/infrastructure/db/sequelize/migrations/${type}/*.ts`
  )

  if (type === MigrationType.All) {
    const ddlMigrations = await getMigrationPaths(MigrationType.DDL)
    const dmlMigrations = await getMigrationPaths(MigrationType.DML)
    return [...ddlMigrations, ...dmlMigrations]
  }
  return glob(pattern.replace(/\\/g, '/')) // normalize for Windows
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
