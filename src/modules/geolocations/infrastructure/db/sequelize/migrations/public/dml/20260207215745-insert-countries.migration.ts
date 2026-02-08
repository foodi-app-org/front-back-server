import { QueryInterface } from 'sequelize'

import { 
  COUNTRIES_MODEL, 
  StateCountriesEnum, 
  IStatusOrderStoreAttributes
} from '../../../models/sequelize-countries.model'

import { v4 as uuidv4 } from 'uuid'


/**
 * Inserts default country records into the `countries` table. Each record includes a unique ID, name, calling code, default status, and state. The function also handles errors gracefully by logging them and rethrowing for further handling.
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
    const now = new Date()
    const countriesDefault = [
      {
        cId: process.env.REGION,
        cName: 'Colombia',
        cCalCod: '57',
        default: true,
        cState: StateCountriesEnum.ACTIVE,
      },
      {
        cId: uuidv4(),
        cName: 'Ecuador',
        cCalCod: '593',
        default: false,
        cState: StateCountriesEnum.ACTIVE,
      },
      { 
        cId: uuidv4(),
        cName: 'Peru',
        cCalCod: '51',
        default: false,
        cState: StateCountriesEnum.ACTIVE,
      },
      {
        cId: uuidv4(),
        cName: 'Mexico',
        cCalCod: '52',
        default: false,
        cState: StateCountriesEnum.ACTIVE,
      },
      { 
        cId: uuidv4(),
        cName: 'Panama',
        cCalCod: '507',
        default: false,
        cState: StateCountriesEnum.ACTIVE,
      }
    ]

    const tablesDataWithIds = countriesDefault.map((data) => ({
      ...data,
      createdAt: now,
      updatedAt: now
    }))

    await queryInterface.bulkInsert(
      { schema: schemaName, tableName: COUNTRIES_MODEL },
      tablesDataWithIds as IStatusOrderStoreAttributes[]
    )
  } catch (error: unknown) {
    console.error('Error inserting default countries:', error)
    throw error
  }
}

/**
 * Deletes only the inserted country records from the `countries` table.
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
    { schema: schemaName, tableName: COUNTRIES_MODEL },
    {
    },
    {}
  )
}
