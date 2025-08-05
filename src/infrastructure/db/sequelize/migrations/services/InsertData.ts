import { QueryTypes, Sequelize } from 'sequelize'

import { MigrationFolder } from '../umzug.config'

interface CopyTableDataToTenantOptions {
  table: string
  tenant: string
  sequelize: Sequelize
}

/**
 * Copies all rows from a table in public schema to the same table in the given tenant schema.
 */
export const copyTableDataToTenant = async ({
  table,
  tenant,
  sequelize,
}: CopyTableDataToTenantOptions): Promise<void> => {
  try {
    // Get column names dynamically from public schema
    const [columnsResult] = await sequelize.query(
      `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = '${MigrationFolder.Public}' AND table_name = :table
      ORDER BY ordinal_position;
      `,
      {
        replacements: { table },
        type: QueryTypes.SELECT,
      }
    ) as [Array<{ column_name: string }>, unknown]
    const columnNames = columnsResult.map((col) => `"${col.column_name}"`).join(', ')

    if (!columnNames.length) {
      throw new Error(`No columns found for table "public.${table}"`)
    }

    // Build and execute insert statement
    const insertQuery = `
      INSERT INTO "${tenant}"."${table}" (${columnNames})
      SELECT ${columnNames}
      FROM "${MigrationFolder.Public}"."${table}";
    `

    await sequelize.query(insertQuery)
  } catch (error) {
    console.error(`❌ Error copying data for table "${table}":`)
    throw error
  }
}
