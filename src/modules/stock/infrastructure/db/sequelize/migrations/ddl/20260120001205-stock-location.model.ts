import { QueryInterface } from 'sequelize'

import { columnsStockLocation, STOCK_LOCATION_MODEL } from '../../models/sequelize-stock-location.model'

/**
 * Migration for creating the `stock_location` table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @param {string} schemaName - The schema where the table will be created.
 * @returns {Promise<void>}
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.createTable(
    {
      tableName: STOCK_LOCATION_MODEL,
      schema: schemaName
    },
    columnsStockLocation
  )
}

/**
 * Migration for dropping the `stock_locations` table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @param {string} schemaName - The schema where the table will be dropped.
 * @returns {Promise<void>}
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.dropTable({
    tableName:  STOCK_LOCATION_MODEL,
    schema: schemaName
  })
}
