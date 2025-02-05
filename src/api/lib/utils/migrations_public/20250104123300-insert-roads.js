import { v4 as uuidv4 } from 'uuid'

const { QueryTypes } = require('sequelize')

const { LogSuccess, LogWarning, LogDanger } = require('../logs') // Ajusta las rutas de los logs si es necesario
const { MODEL_TYPEROAD_NAME } = require('../../models/information/TypeOfRoad')

const typeRoadData = [
  { rName: 'Avenida' },
  { rName: 'Calle' },
  { rName: 'Boulevard' },
  { rName: 'Carretera' },
  { rName: 'Plaza' },
  { rName: 'Camino' },
  { rName: 'Avenida' },
  { rName: 'Diagonal' }
]

exports.up = async (queryInterface) => {
  try {
    for (const typeRoad of typeRoadData) {
      // Verificar si el tipo de carretera ya existe
      const existingTypeRoad = await queryInterface.sequelize.query(
        `SELECT * FROM ${MODEL_TYPEROAD_NAME} WHERE rName = :rName`, {
          replacements: { rName: typeRoad.rName },
          type: QueryTypes.SELECT
        })

      if (existingTypeRoad.length === 0) {
        // Si no existe, insertamos el tipo de carretera
        await queryInterface.bulkInsert(MODEL_TYPEROAD_NAME, [{
          rName: typeRoad.rName,
          rId: uuidv4(),
          rState: 1,
          rDatCre: new Date(),
          rDatMod: new Date()
        }])
        LogSuccess(`Tipo de carretera '${typeRoad.rName}' creado exitosamente.`)
      } else {
        LogWarning(`El tipo de carretera '${typeRoad.rName}' ya existe. No se creará.`)
      }
    }
  } catch (error) {
    LogDanger(`Error al crear tipos de carretera: ${error.message}`)
  }
}

exports.down = async (queryInterface) => {
  // Eliminar los tipos de carretera insertados al revertir la migración
  await queryInterface.bulkDelete(MODEL_TYPEROAD_NAME, null, {})
  LogSuccess('Tipos de carretera eliminados correctamente.')
}
