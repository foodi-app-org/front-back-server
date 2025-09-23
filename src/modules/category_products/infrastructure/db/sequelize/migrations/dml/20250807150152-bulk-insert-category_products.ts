import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { removeTenantPrefix } from '../../../../../../../shared/utils/tenant.utils'
import { CATEGORY_PRODUCT_MODEL } from '../../models/sequelize-model'

export const categories = [
    { pName: 'Combos' },
    { pName: 'Desayunos' },
    { pName: 'Entradas' },
    { pName: 'Panadería' },
    { pName: 'Sopas' },
    { pName: 'Ensaladas' },
    { pName: 'Platos Fuertes' },
    { pName: 'Acompañamientos' },
    { pName: 'Menú Infantil' },
    { pName: 'Postres' },
    { pName: 'Bebidas' },
    { pName: 'NINGUNO' }
]

const mappedCategories = categories.map((category) => ({
    carProId: uuidv4(), // Genera un UUIDv4 para cada categoría
    pName: category.pName,
    pState: 1
}))


/**
 * Creates the `category_products` table in the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be created.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const up = async (
    queryInterface: QueryInterface,
    schemaName: string
): Promise<void> => {

 await queryInterface.bulkInsert(
    {
      schema: schemaName,
      tableName: CATEGORY_PRODUCT_MODEL
    },
    mappedCategories.map((cat) => ({
      ...cat,
      idStore: removeTenantPrefix(schemaName)
    }))
  )

}

/**
 * Drops the `category_products` table from the provided schema.
 *
 * @param {string} schemaName - The schema where the table will be dropped from.
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @returns {Promise<void>}
 */
export const down = async (
    schemaName: string,
    queryInterface: QueryInterface
): Promise<void> => {
    await queryInterface.dropTable({ tableName: CATEGORY_PRODUCT_MODEL, schema: schemaName })
}
