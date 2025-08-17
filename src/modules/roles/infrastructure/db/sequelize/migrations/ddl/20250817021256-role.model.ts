import { QueryInterface } from 'sequelize'

import { columnsRole, ROLE_MODEL } from '../../models/sequelize-roles.model'

/**
 * Migration for creating the `roles` table.
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
      tableName: ROLE_MODEL,
      schema: schemaName
    },
    columnsRole
  )
}

/**
 * Migration for dropping the `roles` table.
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
    tableName: ROLE_MODEL,
    schema: schemaName
  })
}
