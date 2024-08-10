import { Umzug, SequelizeStorage } from 'umzug'
import { STRING } from 'sequelize'

import connect from '../db'

const sequelize = connect()

export const MigrationFolder = {
  Tenanted: 'tenanted',
  Private: 'private'
}

export const UmzugMigrator = async (schemaName) => {
  const model = sequelize.define(
    'MigrationsMeta',
    {
      name: {
        type: STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: false
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
    migrations: {
      glob: ['migrations/*.js', { cwd: __dirname }],
      resolve: ({ name, path, context }) => {
        const migration = require(path || '')
        return {
          name,
          up: async () => migration.up(context, schemaName),
          down: async () => migration.down(context, schemaName)
        }
      }
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({
      model
    }),
    logger: console
  })
}
