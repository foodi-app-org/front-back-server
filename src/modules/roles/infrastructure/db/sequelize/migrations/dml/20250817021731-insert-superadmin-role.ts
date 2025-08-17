import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { models_names } from '../../../../../../../shared/infrastructure/db/sequelize/orm/models'
import { ROLE_MODEL } from '../../models/sequelize-roles.model'

const TAG = 'SUPERADMIN'

/**
 * Migration for inserting the default SUPERADMIN role with all permissions.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - The schema where the role will be inserted.
 * @returns {Promise<void>}
 */
export const up = async (
    queryInterface: QueryInterface,
    schemaName: string
): Promise<void> => {
    const allPermissions = ['create', 'read', 'update', 'delete']
    const [modules] = await queryInterface.sequelize.query(
        `SELECT "view" FROM "${schemaName}.${models_names.Module}"`
    )
    const typedModules = modules as { view: string }[]
    const permissions = typedModules.reduce((acc: Record<string, string[]>, module) => {
        const moduleName = module.view.toLowerCase()
        acc[moduleName] = allPermissions
        return acc
    }, {} as Record<string, string[]>)

    // check if SUPERADMIN already exists
    const [results] = await queryInterface.sequelize.query(
        `SELECT "idRole" FROM "${schemaName}.${ROLE_MODEL}" WHERE "name" = '${TAG}'`
    )

    if ((results as Record<string, unknown>[]).length === 0) {
        await queryInterface.bulkInsert(
            { tableName: ROLE_MODEL, schema: schemaName },
            [
                {
                    idRole: uuidv4(),
                    idStore: null, // puedes pasar el idStore si lo necesitas
                    priority: 1,
                    name: TAG,
                    description: TAG,
                    state: 1,
                    permissions: JSON.stringify(permissions),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]
        )
    }
}

/**
 * Rollback: deletes the SUPERADMIN role.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - The schema where rollback will occur.
 * @returns {Promise<void>}
 */
export const down = async (
    queryInterface: QueryInterface,
    schemaName: string
): Promise<void> => {
    await queryInterface.bulkDelete(
        { tableName: ROLE_MODEL, schema: schemaName },
        { name: TAG }
    )
}
