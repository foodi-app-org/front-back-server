import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { removeTenantPrefix } from '../../../../../../../shared/utils/tenant.utils'
import { CLIENTS_TABLE, IClientAttributes } from '../../models/sequelize-table.model'

/**
 * Seed data for store tables.
 */
const clientsDefault: IClientAttributes[] = [
  {
    cliId: uuidv4(),
    idStore: '',
    idUser: null,
    clState: 1,
    gender: 1,
    clientAddress: '123 Main St',
    clientNumber: '555-1234',
    clientName: 'John Doe',
    clientLastName: 'Doe',
    ccClient: '123456789',
    email: 'john.doe@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
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
  try {

    const tablesDataWithIds = clientsDefault.map((data) => ({
      ...data,
      idStore: removeTenantPrefix(schemaName)
    }))

    await queryInterface.bulkInsert(
      { schema: schemaName, tableName: CLIENTS_TABLE },
      tablesDataWithIds as IClientAttributes[]
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
    { schema: schemaName, tableName: CLIENTS_TABLE },
    {
      ccClient: clientsDefault.map(client => client.ccClient)
    },
    {}
  )
}
