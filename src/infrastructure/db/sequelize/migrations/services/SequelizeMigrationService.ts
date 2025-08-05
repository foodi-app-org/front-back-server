// src/infrastructure/db/sequelize/migrations/services/SequelizeMigrationService.ts


import { MigrationService } from '../../../../../shared/domain/ports/migrationService'
import { createUmzugMigrator, MigrationFolder } from '../umzug.config'

export class SequelizeMigrationService implements MigrationService {
  async execute(schemaName: string): Promise<void> {
    const umzug = await createUmzugMigrator(schemaName as MigrationFolder)
    await umzug.up()
    console.log(`✅ Migrations applied for schema: ${schemaName}`)
  }
}
