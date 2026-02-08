import { QueryInterface } from 'sequelize'
import { columnsDepartments, DEPARTMENT_MODEL } from '../../../models/sequelize-deparments.model'



/**
 * Creates the `departments` table in the provided schema.
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
            tableName: DEPARTMENT_MODEL,
            schema: schemaName
        },
        columnsDepartments
    )
}

/**
 * Drops the `departments` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: DEPARTMENT_MODEL, schema: schemaName })
}
