import { QueryInterface } from 'sequelize'

import { columnsScheduleStore, SCHEDULE_MODEL } from '../../models/sequelize-schedule-store.model'


/**
 * Creates the `schedule_stores` table in the provided schema.
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
            tableName: SCHEDULE_MODEL,
            schema: schemaName
        },
            columnsScheduleStore
    )
}

/**
 * Drops the `schedule_stores` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: SCHEDULE_MODEL, schema: schemaName })
}
