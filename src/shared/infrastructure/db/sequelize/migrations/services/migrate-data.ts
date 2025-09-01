import {
  Model,
  ModelStatic,
  Sequelize
} from 'sequelize'

import { models } from '../../orm/models'
import { MigrationFolder } from '../../migrations/umzug.config'
import { removeTenantPrefix } from '../../../../../utils/tenant.utils'
import { ConsoleLogger } from '../../../../../../shared/infrastructure/logger/console.logger'


const migrate = [
  'User',
  'Store',
] as Array<keyof typeof models>

/**
 * Runs a dynamic migration to copy data from public schema models to the target schema.
 * Optionally skips some models (e.g., users) that should not be migrated.
 * 
 * @param {string} schemaName - Target schema name (e.g. 'tenant_abc')
 * @param {Sequelize} sequelize - Sequelize instance
 */
export const run = async (schemaName: string, sequelize: Sequelize): Promise<void> => {
  const logger = new ConsoleLogger()

  try {
    for (const modelName of Object.keys(models) as Array<keyof typeof models>) {
      if (!migrate.includes(modelName)) {
        logger.info(`⏭️ Skipping ${modelName} migration`)
        continue
      }
      const model: ModelStatic<Model<any, any>> = models[modelName]

      // Read all records from public schema
      const records = await model.schema(MigrationFolder.Public).findAll({
        where: { idStore: removeTenantPrefix(schemaName) },
        raw: true
      })
      if (!records.length) continue

      const cleaned = records.map((record) => ({
        ...record,
      }))

      // Insert into target schema
      await model.schema(schemaName).bulkCreate(cleaned)

      // Generate array list migration SQL
      const migrationQueries = [
        `
        UPDATE "${schemaName}.users"
        SET "idRole" = (
          SELECT r."idRole"
          FROM "${schemaName}.roles" r
          WHERE r."idStore" = '${removeTenantPrefix(schemaName)}' AND r."name" = 'SUPERADMIN'
          LIMIT 1
        )
        WHERE "idStore" = '${removeTenantPrefix(schemaName)}'
        `
      ]

      // execute migration queries
      for (const query of migrationQueries) {
        await sequelize.query(query)
      }

      logger.info(`✅ Migrated ${records.length} ${modelName} records`)
    }

    logger.info(`🎉 Migration completed for schema: ${schemaName}`)
  } catch (error) {
    logger.error(`❌ Migration failed for schema ${schemaName}: ${error}`)
    throw error
  }
}