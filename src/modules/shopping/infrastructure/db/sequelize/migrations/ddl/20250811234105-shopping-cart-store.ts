import { DataTypes, QueryInterface } from 'sequelize'

import { columnsShoppingCart, SHOPPING_CART_MODEL } from '../../models/sequelize-shopping-cart.model'
import { PRODUCT_MODEL_SOLD } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product-sold.model'


/**
 * Creates the `shopping cart` table in the provided schema.
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
            tableName: SHOPPING_CART_MODEL,
            schema: schemaName
        },
        {
            ...columnsShoppingCart,
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
        },
    )
}

/**
 * Drops the `shopping cart` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: SHOPPING_CART_MODEL, schema: schemaName })
}
