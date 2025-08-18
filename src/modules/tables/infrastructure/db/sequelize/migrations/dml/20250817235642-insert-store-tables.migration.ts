import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { STORE_TABLES } from '../../models/sequelize-table.model'

/**
 * Seed data for store tables.
 */
const storeTablesData = [
  {
    seats: 2,
    section: null,
    tableState: 1
  },
  {
    seats: 12,
    section: null,
    tableState: 1
  },
  {
    seats: 10,
    section: null,
    tableState: 1
  },
  {
    seats: 4,
    section: null,
    tableState: 1
  },
  {
    seats: 2,
    section: null,
    tableState: 1
  },
  {
    seats: 4,
    section: null,
    tableState: 1
  },
  {
    seats: 4,
    section: null,
    tableState: 1
  },
  {
    seats: 4,
    section: null,
    tableState: 1
  },
  {
    seats: 4,
    section: null,
    tableState: 1
  },
  {
    seats: 4,
    section: null,
    tableState: 1
  }
]

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
  const now = new Date()

  const tablesDataWithIds = storeTablesData.map((data, index) => ({
    ...data,
    tableId: uuidv4(),
    tableName: `Mesa ${index + 1}`,
    createdAt: now,
    updatedAt: now
  }))

  await queryInterface.bulkInsert(
    { schema: schemaName, tableName: STORE_TABLES },
    tablesDataWithIds
  )
}

/**
 * Deletes all inserted store tables from the `tables` table.
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
    { schema: schemaName, tableName: STORE_TABLES },
    {},
    {}
  )
}
