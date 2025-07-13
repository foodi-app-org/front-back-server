import { v4 as uuidv4 } from 'uuid'

const { MODEL_CITIES_NAME } = require('../../models/information/CitiesModel')
const { PLACES } = require('../places')
const { LogInfo, LogWarning } = require('../logs')

exports.up = async (queryInterface, schemaName) => {
  try {
    const citiesData = PLACES.map((city) => ({
      ctId: uuidv4(),
      code_ctId: city.ctId,
      cName: city.municipio,
      dId: city.c_digo_dane_del_departamento,
      cState: 1
    }))
    await queryInterface.bulkInsert(
      {
        schema: schemaName,
        tableName: MODEL_CITIES_NAME
      },
      citiesData,
      {}
    )
    LogInfo('Ciudades insertadas correctamente.')
  } catch (error) {
    LogWarning('Error al insertar ciudades:', error)
    throw error
  }
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.bulkDelete(
    {
      schema: schemaName,
      tableName: MODEL_CITIES_NAME
    },
    null,
    {}
  )
  LogWarning('Ciudades eliminadas correctamente.')
}
