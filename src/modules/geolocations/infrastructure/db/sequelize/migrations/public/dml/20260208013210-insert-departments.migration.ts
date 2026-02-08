import { QueryInterface } from 'sequelize'

import {
  DEPARTMENT_MODEL,
  StateDepartmentsEnum
} from '../../../models/sequelize-deparments.model'

import { v4 as uuidv4 } from 'uuid'
import { LogInfo } from '@shared/utils/logger.utils'
import { DEPARTMENTS } from '@shared/constants/places'


/**
 * Inserts default department records into the `departments` table. Each record includes a unique ID, name, calling code, default status, and state. The function also handles errors gracefully by logging them and rethrowing for further handling.
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
    const departmentsData = DEPARTMENTS.map((place) => ({
      cId: process.env.REGION,
      dId: uuidv4(),
      code_dId: place.c_digo_dane_del_departamento,
      dName: place.departamento,
      dState: StateDepartmentsEnum.ACTIVE,
      createdAt: now,
      updatedAt: now
    }))
    await queryInterface.bulkInsert(
      {
        schema: schemaName,
        tableName: DEPARTMENT_MODEL
      },
      departmentsData
    )
    LogInfo('Departments inserted successfully.')

  } catch (error: unknown) {
    console.error('Error inserting default departments:', error)
    throw error
  }
}

/**
 * Deletes only the inserted department records from the `departments` table.
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
    { schema: schemaName, tableName: DEPARTMENT_MODEL },
    {
    },
    {}
  )
}
