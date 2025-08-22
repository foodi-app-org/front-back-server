import { QueryInterface } from 'sequelize'

import { columnsDashboardComponents, DASHBOARD_COMPONENTS } from '../../models/sequelize-dashboard-components.model'


/**
 * Creates the `dashboard components` table in the provided schema.
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
            tableName: DASHBOARD_COMPONENTS,
            schema: schemaName
        },
        columnsDashboardComponents
    )
}

/**
 * Drops the `dashboard components` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: DASHBOARD_COMPONENTS, schema: schemaName })
}
