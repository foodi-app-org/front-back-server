import { UmzugMigrator } from '../../utils/migrate-models'

(async () => {
  const defaultSchema = 'public'
  const migrator = await UmzugMigrator(defaultSchema)
  await migrator.runAsCLI()
})()
