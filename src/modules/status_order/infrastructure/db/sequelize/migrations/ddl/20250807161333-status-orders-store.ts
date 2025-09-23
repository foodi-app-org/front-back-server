import { QueryInterface } from 'sequelize'

import { columnsStatusOrdersStore, STATUS_ORDER_MODEL } from '../../models/sequelize-status_orders.model'


/**
 * Creates the `status_order_stores` table in the provided schema.
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
            tableName: STATUS_ORDER_MODEL,
            schema: schemaName
        },
        columnsStatusOrdersStore
    )
}

/**
 * Drops the `status_order_stores` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: STATUS_ORDER_MODEL, schema: schemaName })
}
