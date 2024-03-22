import boom from '@hapi/boom'

import connect from '../db'

import { getTenantName } from './util'
import { UmzugMigrator } from './migrate-models'
import { migrateStoreDataToTenant } from './migrate-data'

async function createTenantSchema (
  { domainSchema = '', idStore = null, idUser = null }
) {
  try {
    const sequelizeInstance = connect()

    await sequelizeInstance.showAllSchemas({ logging: false }).then(async (data) => {
      const isExist = data.find((item) => item === domainSchema)
      if (isExist) {
        throw boom.badRequest('Schema already exists')
      }
      const schemaName = getTenantName(domainSchema)

      // Verificar que domainSchema sea una cadena de caracteres válida
      if (typeof domainSchema !== 'string') {
        throw boom.badRequest('Invalid domain schema name')
      }
      await sequelizeInstance.createSchema(schemaName)
      const migrator = await UmzugMigrator(schemaName)
      await migrator.up()
      await migrateStoreDataToTenant(schemaName, idStore, idUser)
    })
    return {
      message: 'Tenant created successfully'
    }
  } catch (error) {
    throw boom.badRequest(error)
  }
}

export { createTenantSchema }
