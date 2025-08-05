import { DataTypes, QueryInterface, Sequelize } from 'sequelize'

import { USER_MODEL } from '../repositories/sequelize-model'

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
        {
            id: {
                type: DataTypes.STRING(36),
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false
            },
            associateStore: {
                type: DataTypes.JSONB,
                allowNull: true
            },
            name: { type: DataTypes.STRING },
            idRole: { type: DataTypes.STRING(36), allowNull: true },
            username: { type: DataTypes.STRING },
            lastName: { type: DataTypes.STRING },
            email: { type: DataTypes.STRING, unique: true },
            avatar: { type: DataTypes.STRING },
            uToken: { type: DataTypes.STRING(100) },
            uPhoNum: { type: DataTypes.STRING(50) },
            ULocation: { type: DataTypes.STRING(100) },
            upLat: { type: DataTypes.STRING(30) },
            uState: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 0, max: 30
                }
            },
            upLon: { type: DataTypes.STRING(30) },
            upIdeDoc: { type: DataTypes.STRING(50) },
            siteWeb: { type: DataTypes.STRING },
            description: { type: DataTypes.STRING },
            password: { type: DataTypes.STRING },
            createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn('NOW') },
            updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn('NOW') }
        }
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
