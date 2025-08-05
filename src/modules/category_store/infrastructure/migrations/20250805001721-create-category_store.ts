import { QueryInterface } from 'sequelize'

import { CategoryStoreColumns, MODEL_CAT_STORE_NAME } from '../repositories/sequelize-model'


/**
 * Creates the `category_store` table in the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be created.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const up = async (
    queryInterface: QueryInterface,
    schemaName: string,
): Promise<void> => {
    await queryInterface.createTable(
        {
            tableName: MODEL_CAT_STORE_NAME,
            schema: schemaName
        },
            CategoryStoreColumns
    )
}

/**
 * Drops the `category_store` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: MODEL_CAT_STORE_NAME, schema: schemaName })
}
