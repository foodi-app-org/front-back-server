import { QueryInterface } from 'sequelize'

import { columnsProductSubOptionalExtra, PRODUCT_SUB_OPTIONAL_EXTRA } from '../../models/sequelize-product-sub-optional-extra.model'


/**
 * Creates the `products_sub_optional_extras` table in the provided schema.
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
            tableName: PRODUCT_SUB_OPTIONAL_EXTRA,
            schema: schemaName
        },
        columnsProductSubOptionalExtra
    )
}

/**
 * Drops the `products_sub_optional_extras` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: PRODUCT_SUB_OPTIONAL_EXTRA, schema: schemaName })
}
