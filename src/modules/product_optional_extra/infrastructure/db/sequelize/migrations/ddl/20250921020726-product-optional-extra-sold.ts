import { QueryInterface } from 'sequelize'

import { columnsProductOptionalExtraSold, PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL } from '../../models/sequelize-product-optional-extra-sold.model'


/**
 * Creates the `products_optional_extras_sold` table in the provided schema.
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
            tableName: PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL,
            schema: schemaName
        },
        columnsProductOptionalExtraSold
    )
}

/**
 * Drops the `products_optional_extras_sold` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL, schema: schemaName })
}
