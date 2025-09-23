import glob from 'fast-glob'
import path from 'path'
import { STRING } from 'sequelize'
import { SequelizeStorage, Umzug } from 'umzug'

import connect from '../sequelize.connect'

const sequelize = connect()

export enum MigrationFolder {
  Tenanted = 'tenanted',
  Public = 'public',
  Private = 'private',
  Empty = ''
}

export type MigrationType = 'all' | 'ddl' | 'dml'
/**
 * Obtiene las rutas de las migraciones DDL y DML en orden correcto.
 *
 * @returns {Promise<string[]>} Lista de rutas absolutas a los archivos de migración.
 */
export const getMigrationPaths = async (
  type: MigrationType = 'all'
): Promise<string[]> => {
  if (type === 'ddl') {
    const ddlEntries = await glob([
      'src/modules/**/infrastructure/db/sequelize/migrations/ddl/*.ts',
      'src/modules/**/infrastructure/db/sequelize/migrations/ddl/*.js'
    ])
    return ddlEntries.map(file => path.resolve(file))
  }

  if (type === 'dml') {
    const dmlEntries = await glob([
      'src/modules/**/infrastructure/db/sequelize/migrations/dml/*.ts',
      'src/modules/**/infrastructure/db/sequelize/migrations/dml/*.js'
    ])
    return dmlEntries.map(file => path.resolve(file))
  }

  // 'all': primero las DDL, luego las DML
  const ddlEntries = await glob([
    'src/modules/**/infrastructure/db/sequelize/migrations/ddl/*.ts',
    'src/modules/**/infrastructure/db/sequelize/migrations/ddl/*.js'
  ])
  const dmlEntries = await glob([
    'src/modules/**/infrastructure/db/sequelize/migrations/dml/*.ts',
    'src/modules/**/infrastructure/db/sequelize/migrations/dml/*.js'
  ])
  return [
    ...ddlEntries.map(file => path.resolve(file)),
    ...dmlEntries.map(file => path.resolve(file))
  ]
}

/**
 * Builds a configured Umzug migrator for a given schema and migration type (DDL or DML).
 *
 * @param {string} schemaName - The DB schema to apply migrations on.
 * @param {MigrationType} type - Migration type: ddl | dml.
 * @returns {Promise<Umzug>} - Configured Umzug instance.
 */
export const createUmzugMigrator = async (
  schemaName: MigrationFolder = MigrationFolder.Public,
  type: MigrationType = 'all',
  customMigrationFiles: string[] = []
): Promise<Umzug> => {
  const migrationFiles = customMigrationFiles.length
    ? customMigrationFiles
    : await getMigrationPaths(type)
  // const migrationFiles = await getMigrationPaths(type)

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

  return new Umzug({
    migrations: migrationFiles.map((file) => ({
      name: path.basename(file),
      up: async ({ context }) =>
        (await import(file)).up(context, schemaName),
      down: async ({ context }) =>
        (await import(file)).down(context, schemaName)
    })),
    context: sequelize.getQueryInterface() as object,
    storage: new SequelizeStorage({ model }),
    logger: console
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
  const ddlMigrator = await createUmzugMigrator(schemaName, 'ddl')
  await ddlMigrator.up()

  console.log('🚀 Running DML migrations...')
  const dmlMigrator = await createUmzugMigrator(schemaName, 'dml')
  await dmlMigrator.up()

  console.log('✅ All migrations completed successfully!')
}
