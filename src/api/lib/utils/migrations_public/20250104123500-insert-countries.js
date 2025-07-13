import { v4 as uuidv4 } from 'uuid'

const { LogSuccess, LogDanger } = require('../logs')
const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')

export const COUNTRIES = [
  {
    cId: '57',
    name: 'Colombia',
    code: '57',
    region: 'CO'
  }
]

/**
 * Insert default countries
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {string} schemaName
 */
exports.up = async (queryInterface, schemaName) => {
  try {
    const data = COUNTRIES.map(country => ({
      cId: uuidv4(),
      cName: country.name,
      cCalCod: country.code,
      cState: 1,
      code_ctId: country.region
    }))
    await queryInterface.bulkInsert(
      { tableName: MODEL_COUNTRIES_NAME, schema: schemaName },
      data
    )
    LogSuccess('Países insertados correctamente.')
  } catch (error) {
    LogDanger(`Error al crear países: ${error.message}`)
    throw error
  }
}

/**
 * Delete all inserted type roads
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {string} schemaName
 */
exports.down = async (queryInterface, schemaName) => {
  await queryInterface.bulkDelete(
    { tableName: MODEL_COUNTRIES_NAME, schema: schemaName },
    {
      cId: COUNTRIES.map(t => t.cId)
    }
  )
  LogSuccess('Países eliminados correctamente.')
}
