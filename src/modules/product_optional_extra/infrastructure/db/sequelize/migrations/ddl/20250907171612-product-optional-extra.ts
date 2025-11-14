import { DataTypes, QueryInterface } from 'sequelize'

import { columnsProductOptionalExtra, PRODUCT_OPTIONAL_EXTRA_MODEL } from '../../models/sequelize-product-optional-extra.model'
import { PRODUCT_MODEL } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product.model'


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
        {
            ...columnsProductOptionalExtra,
            pId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: PRODUCT_MODEL,
                        schema: schemaName
                    },
                    key: 'pId'
                }
            }
        }
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
