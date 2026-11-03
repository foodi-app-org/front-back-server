import { QueryInterface } from 'sequelize'

import {
  columnsRefreshToken,
  REFRESH_TOKEN_MODEL
} from '../../../models/sequelize-refresh-token.model'

/**
 * Creates the `refresh_tokens` table in the provided schema.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - The schema where the table will be created.
 * @returns {Promise<void>}
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.createTable(
    {
      tableName: REFRESH_TOKEN_MODEL,
      schema: schemaName
    },
    columnsRefreshToken
  )
}

/**
 * Drops the `refresh_tokens` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @returns {Promise<void>}
 */
export const down = async (
  schemaName: string,
  queryInterface: QueryInterface
): Promise<void> => {
  await queryInterface.dropTable({ tableName: REFRESH_TOKEN_MODEL, schema: schemaName })
}
