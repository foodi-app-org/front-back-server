import { QueryInterface } from 'sequelize'

import { columnsTagsProduct, TAGS_PRODUCT_MODEL_NAME } from '../../models/sequelize-tags.model'

/**
 * Creates the `tags_products` table in the provided schema.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @param {string} schemaName - The schema where the table will be created.
 * @returns {Promise<void>}
 */
export const up = async (
    queryInterface: QueryInterface,
    schemaName: string,
): Promise<void> => {
    await queryInterface.createTable(
        {
            tableName: TAGS_PRODUCT_MODEL_NAME,
            schema: schemaName
        },
        columnsTagsProduct
    )
}

/**
 * Drops the `tags_products` table from the provided schema.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @param {string} schemaName - The schema from which the table will be dropped.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: TAGS_PRODUCT_MODEL_NAME, schema: schemaName })
}
