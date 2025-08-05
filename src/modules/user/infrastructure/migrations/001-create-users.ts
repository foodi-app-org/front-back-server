import { QueryInterface } from 'sequelize'

/**
 * Creates the `users` table and inserts a test user (SQLite compatible).
 * 
 * @param {QueryInterface} queryInterface
 */
export const up = async (
    queryInterface: QueryInterface,
    schemaName: string
): Promise<void> => {
    try {
        await queryInterface.bulkInsert({ tableName: 'users', schema: schemaName }, [
            {
                id: crypto.randomUUID(),
                name: 'Test',
                email: 'juvinaojesus@example.com',
                password: 'changeme',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])
    } catch (error) {
        console.error('Error inserting test user:', error)
        throw error
    }
}

/**
 * Drops the `users` table.
 * 
 * @param {QueryInterface} queryInterface
 */
export const down = async (
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable('users')
}
