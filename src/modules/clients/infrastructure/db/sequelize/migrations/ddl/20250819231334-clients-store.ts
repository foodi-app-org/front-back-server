import { QueryInterface } from 'sequelize'

import { CLIENTS_TABLE, columnsClient } from '../../models/sequelize-table.model'


/**
 * Creates the `clients` table in the provided schema.
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
            tableName: CLIENTS_TABLE,
            schema: schemaName
        },
        columnsClient
    )
}

/**
 * Drops the  `clients`  table from the provided schema.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: CLIENTS_TABLE, schema: schemaName })
}
