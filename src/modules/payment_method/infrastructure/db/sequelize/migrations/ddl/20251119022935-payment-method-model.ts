import { QueryInterface } from 'sequelize'

import { PAYMENT_METHOD_MODEL, PaymentMethodColumns } from '../../models/sequelize-payment_method.model'

/**
 * Migration for creating `payment_methods` table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Schema where the tables will be created.
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  // Then create child table
  await queryInterface.createTable(
    { tableName: PAYMENT_METHOD_MODEL, schema: schemaName },
    PaymentMethodColumns
  )
}

/**
 * Rollback for dropping `payment_methods` table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Schema where the tables will be dropped.
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  // Drop child table first
  await queryInterface.dropTable({
    tableName: PAYMENT_METHOD_MODEL,
    schema: schemaName
  })
}
