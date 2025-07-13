import { LogInfo } from '../../utils/logs'
import { MigrationFolder, UmzugMigrator } from '../../utils/migrate-models'

(async () => {
  const defaultSchema = MigrationFolder.public
  LogInfo(`Running migrations in schema: ${defaultSchema}`)
  const migrator = await UmzugMigrator(defaultSchema, 'migrations_public/*.js')
  await migrator.runAsCLI()
})()
