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

/**
 * Find and return all absolute migration file paths from modules.
 *
 * @returns {Promise<string[]>}
 */
const getMigrationPaths = async (): Promise<string[]> => {
  const entries = await glob([
    'src/modules/**/infrastructure/db/sequelize/migrations/*.ts',
    'src/modules/**/infrastructure/db/sequelize/migrations/*.js'
  ])
  return entries.map(file => path.resolve(file))
}

/**
 * Builds a configured Umzug migrator for a given schema and all module migration files.
 *
 * @param {string} schemaName - The DB schema to apply migrations on.
 * @returns {Promise<Umzug>} - Configured Umzug instance.
 */
export const createUmzugMigrator = async (
  schemaName: MigrationFolder = MigrationFolder.Public
): Promise<Umzug> => {
  const migrationFiles = await getMigrationPaths()

  // Define a tracking model per schema
  const model = sequelize.define(
    'MigrationsMeta',
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
      modelName: 'migrations_meta',
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    }
  )

  return new Umzug({
    migrations: migrationFiles.map(file => ({
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
