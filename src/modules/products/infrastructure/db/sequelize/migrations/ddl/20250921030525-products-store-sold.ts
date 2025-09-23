import { QueryInterface } from 'sequelize'

import { columnsProductSold, PRODUCT_MODEL_SOLD } from '../../models/sequelize-product-sold.model'


/**
 * Creates the `columnsProductSold` table in the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be created.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const up = async (
    queryInterface: QueryInterface,
    schemaName: string
): Promise<void> => {
    await queryInterface.createTable(
        {
            tableName: PRODUCT_MODEL_SOLD,
            schema: schemaName
        },
        columnsProductSold
    )
}

/**
 * Drops the `columnsProductSold` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: PRODUCT_MODEL_SOLD, schema: schemaName })
}
