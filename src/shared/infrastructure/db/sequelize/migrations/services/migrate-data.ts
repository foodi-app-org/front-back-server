import {
 Model,ModelStatic, Sequelize 
} from 'sequelize'

import { models } from '../../orm/models'

/**
 * Runs a dynamic migration to copy data from public schema models to the target schema.
 * @param {string} schemaName - Target schema name (e.g. 'tenant_abc')
 * @param {Sequelize} sequelize - Sequelize instance
 */
export const run = async (schemaName: string, sequelize: Sequelize): Promise<void> => {
  try {
    for (const modelName of Object.keys(models) as Array<keyof typeof models>) {
      const model: ModelStatic<Model<any, any>> = models[modelName]

      // Read all records from public schema
      const records = await model.findAll({ raw: true })
      if (!records.length) continue

      const cleaned = records.map((record) => ({
        ...record,
      }))

      // Insert into target schema
      await model.schema(schemaName).bulkCreate(cleaned)

      console.log(`✅ Migrated ${records.length} ${modelName} records`)
    }

    console.log(`🎉 Migration completed for schema: ${schemaName}`)
  } catch (error) {
    console.error(`❌ Migration failed for schema ${schemaName}:`, error)
    throw error
  }
}
