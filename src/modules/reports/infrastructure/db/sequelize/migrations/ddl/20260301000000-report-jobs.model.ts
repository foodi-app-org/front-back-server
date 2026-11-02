import { QueryInterface } from 'sequelize'

import { columnsReportJob, REPORT_JOB_MODEL } from '../../models/sequelize-report-job.model'

/**
 * Creates the tenant `report_jobs` table. Applied automatically to every new
 * store through the store-creation migration flow, and ensured at runtime for
 * existing stores by the report job repository.
 *
 * @param queryInterface - Sequelize query interface.
 * @param schemaName - Tenant schema the table is created in.
 * @returns {Promise<void>}
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.createTable(
    {
      tableName: REPORT_JOB_MODEL,
      schema: schemaName
    },
    columnsReportJob
  )
}

/**
 * Drops the tenant `report_jobs` table.
 *
 * @param queryInterface - Sequelize query interface.
 * @param schemaName - Tenant schema the table is dropped from.
 * @returns {Promise<void>}
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.dropTable({
    tableName: REPORT_JOB_MODEL,
    schema: schemaName
  })
}
