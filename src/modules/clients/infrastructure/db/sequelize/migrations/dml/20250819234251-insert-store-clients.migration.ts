import { QueryInterface } from 'sequelize'

import { removeTenantPrefix } from '../../../../../../../shared/utils/tenant.utils'
import { CLIENTS_TABLE, defaultEnum, IClientAttributes } from '../../models/sequelize-table.model'

export enum clientEnum {
  legal_id = '1234567890',
  email = 'john.doe@example.com'
}
/**
 * Seed data for store tables.
 */


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
    const clientsDefault: IClientAttributes[] = [
      {
        cliId: idStore,
        idStore: idStore,
        idUser: null,
        clState: 1,
        gender: 1,
        clientAddress: '123 Main St',
        clientNumber: '555-1234',
        clientName: 'John Doe',
        clientLastName: 'Doe',
        ccClient: clientEnum.legal_id,
        email: clientEnum.email,
        default: defaultEnum.TRUE === 1,
        createdAt: now,
        updatedAt: now
      }
    ]

    const tablesDataWithIds = clientsDefault.map((data) => ({
      ...data,
      idStore
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
    },
    {}
  )
}
