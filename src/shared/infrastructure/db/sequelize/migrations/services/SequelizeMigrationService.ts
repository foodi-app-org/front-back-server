// src/infrastructure/db/sequelize/migrations/services/SequelizeMigrationService.ts


import { MigrationService } from '../../../../../domain/ports/migrationService'
import connect from '../../sequelize.connect'
import { createUmzugMigrator, MigrationFolder } from '../umzug.config'
import { run } from './migrate-data'

export class SequelizeMigrationService implements MigrationService {
  async execute(schemaName: string): Promise<void> {
    try {
      const umzug = await createUmzugMigrator(schemaName as MigrationFolder)
      await umzug.up()
    } catch (error) {
      console.error(`Error executing migrations for schema ${schemaName}:`, error)
      throw error
    }
  }
  async migrate(schemaName: string): Promise<void> {
    const sequelize = connect()
    console.log(`Running data migration for schema: ${schemaName}`)
    await run(schemaName, sequelize)
  }
}
