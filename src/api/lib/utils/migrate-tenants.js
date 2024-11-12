import connect from '../db'

import { LogDanger, LogSuccess } from './logs'
import { UmzugMigrator } from './migrate-models'

const tenantMigrator = async () => {
  const sequelizeInstance = connect()
  const schemas = await sequelizeInstance.showAllSchemas({ logging: false })

  for (const schema of schemas) {
    const umzug = await UmzugMigrator(schema)

    try {
      await umzug.up() // Ejecuta todas las migraciones pendientes
      LogSuccess(`Migrated schema: ${schema}`)
    } catch (error) {
      LogDanger(`Failed to migrate schema: ${schema} ${error}`)
    }
  }

  return {
    message: 'Tenant migration completed successfully'
  }
}

if (require.main === module) {
  tenantMigrator().then((result) => {
    LogSuccess(`Tenant migration completed successfully, ${result.message}`)
  }).catch((error) => {
    LogDanger(`Error during tenant migration: ${error}`)
  })
}

export default tenantMigrator
