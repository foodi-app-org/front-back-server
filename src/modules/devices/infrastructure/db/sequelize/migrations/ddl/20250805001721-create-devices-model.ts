import { QueryInterface } from 'sequelize'

import { DeviceColumns, USER_DEVICE_MODEL } from '../../models/sequelize-model'

/**
 * Migration: Creates the `devices` table in the given schema.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface used to execute SQL operations.
 * @param {string} schemaName - The schema where the table will be created.
 * @returns {Promise<void>} A promise that resolves when the table has been created.
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.createTable(
    {
      tableName: USER_DEVICE_MODEL,
      schema: schemaName
    },
    DeviceColumns
  )
}

/**
 * Migration: Drops the `devices` table from the given schema.
 *
 * @param {string} schemaName - The schema from which the table will be dropped.
 * @param {QueryInterface} queryInterface - Sequelize query interface used to execute SQL operations.
 * @returns {Promise<void>} A promise that resolves when the table has been dropped.
 */
export const down = async (
  schemaName: string,
  queryInterface: QueryInterface
): Promise<void> => {
  await queryInterface.dropTable({
    tableName: USER_DEVICE_MODEL,
    schema: schemaName
  })
}
