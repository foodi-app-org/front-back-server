import { v4 as uuidv4 } from 'uuid'

const { LogSuccess, LogDanger } = require('../logs')
const { MODEL_TYPEROAD_NAME } = require('../../models/information/TypeOfRoad')

const typeRoadData = [
  { rName: 'Avenida' },
  { rName: 'Calle' },
  { rName: 'Boulevard' },
  { rName: 'Carretera' },
  { rName: 'Plaza' },
  { rName: 'Camino' },
  { rName: 'Diagonal' },
  { rName: 'Carrera' },
  { rName: 'Transversal' },
  { rName: 'Circular' },
  { rName: 'Autopista' },
  { rName: 'Vía' },
  { rName: 'Trocha' }
]

/**
 * Insert default type roads
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {string} schemaName
 */
exports.up = async (queryInterface, schemaName) => {
  try {
    const data = typeRoadData.map(type => ({
      rId: uuidv4(),
      rName: type.rName,
      rState: 1
    }))
    await queryInterface.bulkInsert(
      { tableName: MODEL_TYPEROAD_NAME, schema: schemaName },
      data
    )
    LogSuccess('Tipos de carretera insertados correctamente.')
  } catch (error) {
    LogDanger(`Error al crear tipos de carretera: ${error.message}`)
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
    { tableName: MODEL_TYPEROAD_NAME, schema: schemaName },
    {
      rName: typeRoadData.map(t => t.rName)
    }
  )
  LogSuccess('Tipos de carretera eliminados correctamente.')
}
