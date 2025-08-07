import { QueryInterface } from 'sequelize'

import { USER_MODEL } from '../repositories/sequelize-model'

/**
 * Creates the `users` table and inserts a test user (SQLite compatible).
 * 
 * @param {QueryInterface} queryInterface
 */
export const up = async (
    queryInterface: QueryInterface,
    schemaName: string,
): Promise<void> => {
    function generateRandomEmail(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
        const nameLength = 8
        let name = ''
        for (let i = 0; i < nameLength; i++) {
            name += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return `${name}@example.com`
    }

    await queryInterface.bulkInsert({ tableName: 'users', schema: schemaName }, [
        {
            id: crypto.randomUUID(),
            name: 'Test',
            email: generateRandomEmail(),
            password: 'changeme',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ])
}

/**
 * Drops the `users` table.
 * 
 * @param {QueryInterface} queryInterface
 */
export const down = async (
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable(USER_MODEL)
}
