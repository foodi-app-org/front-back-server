import { QueryInterface } from 'sequelize'

import { removeTenantPrefix } from '../../../../../../../shared/utils/tenant.utils'
import { STOCK_LOCATION_MODEL } from '../../models/sequelize-stock-location.model'

const typesDescription = {
  PREP: 'Preparation Area',
  SALE: 'Sales Floor',
  STORAGE: 'Storage Area',
  DAMAGED: 'Damaged Goods',
  TRANSIT: 'In Transit'
}

const types = Object.keys(typesDescription)

/**
 * Inserts initial store tables into the `tables` table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @param {string} schemaName - Schema where the data will be inserted.
 * @returns {Promise<void>}
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  try {
    const idStore = removeTenantPrefix(schemaName)
    const now = new Date()
    const stockLocation = types.map((type, index) => ({
      id: `stock-location-${type.toLowerCase()}`,
      name: `${typesDescription[type as keyof typeof typesDescription]}`,
      description: `Default location for ${typesDescription[type as keyof typeof typesDescription]}`,
      type,
      priority: index + 1,
      createdAt: now,
      updatedAt: now
    }))

    const tablesDataWithIds = stockLocation.map((data) => ({
      ...data,
      idStore
    }))

    await queryInterface.bulkInsert(
      { schema: schemaName, tableName: STOCK_LOCATION_MODEL },
      tablesDataWithIds
    )
  } catch (error: unknown) {
    console.error('Error inserting default clients:', error)
    throw error
  }
}

/**
 * Deletes only the inserted store tables from the `tables` table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface for executing SQL operations.
 * @param {string} schemaName - Schema where the data will be deleted from.
 * @returns {Promise<void>}
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.bulkDelete(
    { schema: schemaName, tableName: STOCK_LOCATION_MODEL },
    {
    },
    {}
  )
}
