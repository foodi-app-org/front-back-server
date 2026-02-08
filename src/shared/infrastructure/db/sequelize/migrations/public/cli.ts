
import { LogDanger, LogInfo } from "@shared/utils/logger.utils"
import { 
  createUmzugMigrator, 
  getMigrationPaths, 
  MigrationFolder, 
  MigrationType
} from "../umzug.config"

export const run = async () => {
  const customMigrationFiles = await getMigrationPaths(MigrationType.PUBLIC)
  if (customMigrationFiles.length === 0) {
    LogDanger('⚠️ No migration files found. Exiting.')
    return
  }
  LogInfo(`🚀 Found ${customMigrationFiles.length} migration files. Starting migration...`)
  const umzug = await createUmzugMigrator(MigrationFolder.Public, MigrationType.PUBLIC, customMigrationFiles)
  await umzug.up()
  LogInfo('✅ All migrations applied.')
}

run().catch(() => {
  LogDanger('❌ Migration failed. Check the error above for details.')
  process.exit(1)
})
