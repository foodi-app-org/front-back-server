import { DataTypes, QueryInterface } from 'sequelize'

import { columnsProductOptionalExtraSold, PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL } from '../../models/sequelize-product-optional-extra-sold.model'
import { PRODUCT_MODEL_SOLD } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product-sold.model'


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
        {
            ...columnsProductOptionalExtraSold,
            pId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: PRODUCT_MODEL_SOLD,
                        schema: schemaName
                    },
                    key: 'pId'
                }
            }
        }
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
