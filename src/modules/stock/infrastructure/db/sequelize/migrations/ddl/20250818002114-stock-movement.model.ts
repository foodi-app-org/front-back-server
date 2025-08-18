import { QueryInterface } from 'sequelize'

import { columnsStockMovement, STOCK_MOVEMENT_NAME } from '../../models/sequelize-stock.model'

/**
 * Migration for creating the `stock_movements` table.
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
      tableName: STOCK_MOVEMENT_NAME,
      schema: schemaName
    },
    columnsStockMovement
  )
}

/**
 * Migration for dropping the `stock_movements` table.
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
    tableName: STOCK_MOVEMENT_NAME,
    schema: schemaName
  })
}
