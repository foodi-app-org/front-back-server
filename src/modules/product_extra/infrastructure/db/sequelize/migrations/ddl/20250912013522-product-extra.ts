import { QueryInterface } from 'sequelize'

import { columnsProductExtra, EXTRA_PRODUCT_MODEL } from '../../models/sequelize-product-extra.model/sequelize-product-extra.model'


/**
 * Creates the `products_extras` table in the provided schema.
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
            tableName: EXTRA_PRODUCT_MODEL,
            schema: schemaName
        },
        columnsProductExtra
    )
}

/**
 * Drops the `products_extras` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: EXTRA_PRODUCT_MODEL, schema: schemaName })
}
