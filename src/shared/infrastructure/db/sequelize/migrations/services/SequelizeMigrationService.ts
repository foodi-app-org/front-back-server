import { MigrationService } from '../../../../../domain/ports/migrationService'
import { ConsoleLogger } from '../../../../logger/console.logger'
import connect from '../../sequelize.connect'
import {
  createUmzugMigrator,
  MigrationFolder,
  MigrationType
} from '../umzug.config'
import { run } from './migrate-data'

export class SequelizeMigrationService implements MigrationService {
  private readonly logger = new ConsoleLogger()

  // Example usage in methods:
  async execute(schemaName: string, type?: MigrationType, customMigrationFiles?: string[]): Promise<void> {
    this.logger.info('Starting migration...')
    this.logger.info(`Connected to database for schema: ${schemaName}`)
    try {
      const umzug = await createUmzugMigrator(schemaName as MigrationFolder, type, customMigrationFiles)
      await umzug.up()
    } catch (error) {
      this.logger.error(`Error executing migrations for schema ${schemaName}:`)
      this.logger.error(error instanceof Error ? error.message : String(error))
      throw error
    }
  }



  async migrate(schemaName: string): Promise<void> {
    const sequelize = connect()

    this.logger.info(`Running data migration for schema: ${schemaName}`)
    await run(schemaName, sequelize)
  }


}
