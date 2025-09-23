import { QueryInterface } from 'sequelize'

import { columnsProductOptionalExtra, PRODUCT_OPTIONAL_EXTRA_MODEL } from '../../models/sequelize-product-optional-extra.model'


/**
 * Creates the `productsoptionalextras` table in the provided schema.
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
            tableName: PRODUCT_OPTIONAL_EXTRA_MODEL,
            schema: schemaName
        },
        columnsProductOptionalExtra
    )
}

/**
 * Drops the `productsoptionalextras` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: PRODUCT_OPTIONAL_EXTRA_MODEL, schema: schemaName })
}
