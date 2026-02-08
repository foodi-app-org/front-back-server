import { QueryInterface } from 'sequelize'


import { v4 as uuidv4 } from 'uuid'
import { LogInfo } from '@shared/utils/logger.utils'
import { PLACES } from '@shared/constants/places'
import { CITIES_MODEL, StateCitiesEnum } from '../../../models/sequelize-cities.model'


/**
 * Inserts default city records into the `cities` table. Each record includes a unique ID, name, calling code, default status, and state. The function also handles errors gracefully by logging them and rethrowing for further handling.
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
    const citiesData = PLACES.map((city) => ({
      ctId: uuidv4(),
      code_ctId: city.ctId,
      cName: city.municipio,
      dId: city.c_digo_dane_del_departamento,
      cState: StateCitiesEnum.ACTIVE,
      createdAt: now,
      updatedAt: now
    }))
    await queryInterface.bulkInsert(
      {
        schema: schemaName,
        tableName: CITIES_MODEL
      },
      citiesData,
      {}
    )
    LogInfo('Cities inserted successfully.')

  } catch (error: unknown) {
    console.error('Error inserting default cities:', error)
    throw error
  }
}

/**
 * Deletes only the inserted city records from the `cities` table.
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
    { schema: schemaName, tableName: CITIES_MODEL },
    {
    },
    {}
  )
}
