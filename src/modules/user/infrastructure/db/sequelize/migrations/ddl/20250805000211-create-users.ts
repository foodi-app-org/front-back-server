import { QueryInterface } from 'sequelize'

import { columnsUser, USER_MODEL } from '../../models/sequelize-user.model'

/**
 * Up migration to create users table and insert a test user.
 * 
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Schema where the table will be created.
 */
export const up = async (
    queryInterface: QueryInterface,
    schemaName: string,
): Promise<void> => {
    await queryInterface.createTable(
        { tableName: USER_MODEL, schema: schemaName },
        columnsUser
    )
}

/**
 * Down migration to drop the users table.
 * 
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Schema where the table exists.
 */
export const down = async (
    queryInterface: QueryInterface,
    schemaName: string
): Promise<void> => {
    await queryInterface.dropTable({ tableName: USER_MODEL, schema: schemaName })
}
