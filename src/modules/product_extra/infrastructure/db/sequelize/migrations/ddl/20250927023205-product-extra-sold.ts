import { QueryInterface } from 'sequelize'

import { columnsProductExtraSold, EXTRA_PRODUCT_MODEL_SOLD } from '../../models/sequelize-product-extra.model/sequelize-product-extra-sold.model'


/**
 * Creates the `products_extras_sold` table in the provided schema.
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
            tableName: EXTRA_PRODUCT_MODEL_SOLD,
            schema: schemaName
        },
        columnsProductExtraSold
    )
}

/**
 * Drops the `products_extras_sold` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: EXTRA_PRODUCT_MODEL_SOLD, schema: schemaName })
}
