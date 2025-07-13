import { MigrationFolder, UmzugMigrator } from '../../utils/migrate-models'

(async () => {
  const defaultSchema = MigrationFolder.public
  const migrator = await UmzugMigrator(defaultSchema)
  await migrator.runAsCLI()
})()
