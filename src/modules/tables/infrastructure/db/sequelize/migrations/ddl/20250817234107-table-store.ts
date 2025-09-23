import { QueryInterface } from 'sequelize'

import { columnsTable, STORE_TABLES } from '../../models/sequelize-table.model'


/**
 * Creates the `store_tables` table in the provided schema.
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
            tableName: STORE_TABLES,
            schema: schemaName
        },
        columnsTable
    )
}

/**
 * Drops the `store_tables` table from the provided schema.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @param {string} schemaName - The schema from which the table will be dropped.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: STORE_TABLES, schema: schemaName })
}
