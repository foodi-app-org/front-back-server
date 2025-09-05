import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { states, TAGS_PRODUCT_MODEL_NAME } from '../../models/sequelize-tags.model'
import { removeTenantPrefix } from '../../../../../../../shared/utils/tenant.utils'

const tagNames = [
    {
        nameTag: 'Bebidas'
    },
    {
        nameTag: 'Comida'
    },
    {
        nameTag: 'Postres'
    },
    {
        nameTag: 'Entradas'
    },
    {
        nameTag: 'Vinos'
    }
]

/**
 * Inserts default product tags into the `tagsProduct` table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Schema where tags will be inserted.
 * @returns {Promise<void>}
 */
export const up = async (
    queryInterface: QueryInterface,
    schemaName: string
): Promise<void> => {

    const tags = tagNames.map(nameTag => ({
        tgId: uuidv4(),
        idStore: removeTenantPrefix(schemaName),
        idUser: null,
        nameTag: nameTag.nameTag,
        state: states.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
    }))
    await queryInterface.bulkInsert(
        { tableName: TAGS_PRODUCT_MODEL_NAME, schema: schemaName },
        tags
    )
}

/**
 * Deletes the inserted default tags.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Schema where tags were inserted.
 * @returns {Promise<void>}
 */
export const down = async (
    queryInterface: QueryInterface,
    schemaName: string
): Promise<void> => {
    await queryInterface.bulkDelete(
        { tableName: TAGS_PRODUCT_MODEL_NAME, schema: schemaName },
        {
            nameTag: tagNames.map(tag => tag.nameTag)
        }
    )
}
