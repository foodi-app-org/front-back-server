import { createUmzugMigrator, MigrationFolder } from './umzug.config'

const run = async () => {
  const umzug = await createUmzugMigrator(MigrationFolder.Public)
  await umzug.up()
  console.log('✅ All migrations applied.')
}

run().catch(err => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
