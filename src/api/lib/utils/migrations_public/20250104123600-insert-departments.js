import path from 'path'

import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

import { DEPARTMENTS } from '../places'
import { LogInfo, LogWarning, LogDanger } from '../logs'

const { MODEL_DEPARTMENTS_NAME } = require('../../models/information/DepartmentsModel')

dotenv.config({
  path: path.join(__dirname, '../../../../../.env')
})

/**
 * Insert departments associated with a country
 * @param {object} queryInterface
 * @param {string} schemaName
 */
exports.up = async (queryInterface, schemaName) => {
  try {
    const departmentsData = DEPARTMENTS.map((place) => ({
      cId: process.env.REGION,
      dId: uuidv4(),
      code_dId: place.c_digo_dane_del_departamento,
      dName: place.departamento,
      dState: 1
    }))
    await queryInterface.bulkInsert(
      {
        schema: schemaName,
        tableName: MODEL_DEPARTMENTS_NAME
      },
      departmentsData
    )
    LogInfo('Departments inserted successfully.')
  } catch (error) {
    LogDanger('Error inserting departments:', error)
    throw error
  }
}

exports.down = async (queryInterface, schemaName) => {
  try {
    await queryInterface.bulkDelete(
      {
        schema: schemaName,
        tableName: MODEL_DEPARTMENTS_NAME
      },
      null,
      {}
    )

    LogWarning('Departments deleted successfully.')
  } catch (error) {
    LogDanger('Error deleting departments:', error)
  }
}
