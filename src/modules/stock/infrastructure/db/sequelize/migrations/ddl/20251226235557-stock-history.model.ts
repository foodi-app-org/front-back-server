import { QueryInterface } from 'sequelize'

import { columnsStockHistory, STOCK_HISTORY_MODEL } from '../../models/sequelize-stock-history.model'

/**
 * Migration for creating the `stock_history` table.
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
      tableName: STOCK_HISTORY_MODEL,
      schema: schemaName
    },
    columnsStockHistory
  )
}

/**
 * Migration for dropping the `stock_history` table.
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
    tableName:  STOCK_HISTORY_MODEL,
    schema: schemaName
  })
}
