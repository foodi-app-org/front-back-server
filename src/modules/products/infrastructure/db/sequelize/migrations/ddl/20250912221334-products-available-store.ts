import { QueryInterface } from 'sequelize'

import { columnsAvailableProduct, PRODUCT_AVAILABLE } from '../../models/sequelize-available-product.model'


/**
 * Creates the `product_availables` table in the provided schema.
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
            tableName: PRODUCT_AVAILABLE,
            schema: schemaName
        },
        columnsAvailableProduct
    )
}

/**
 * Drops the `product_availables` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: PRODUCT_AVAILABLE, schema: schemaName })
}
