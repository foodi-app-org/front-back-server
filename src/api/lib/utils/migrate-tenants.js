import connect from '../db'

import { UmzugMigrator } from './migrate-models'

const tenantMigrator = async () => {
  const sequelizeInstance = connect()
  const schemas = await sequelizeInstance.showAllSchemas({ logging: false })

  for (const schema of schemas) {
    const umzug = await UmzugMigrator(schema)

    try {
      await umzug.up() // Ejecuta todas las migraciones pendientes
      console.log(`Migrated schema: ${schema}`)
    } catch (error) {
      console.error(`Failed to migrate schema: ${schema}`, error)
    }
  }

  return {
    message: 'Tenant migration completed successfully'
  }
}

if (require.main === module) {
  tenantMigrator().then((result) => {
    console.log(result.message)
  }).catch((error) => {
    console.error('Error during tenant migration:', error)
  })
}

export default tenantMigrator
