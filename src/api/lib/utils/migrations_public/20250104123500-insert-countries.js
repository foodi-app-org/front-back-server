import { v4 as uuidv4 } from 'uuid'

const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')
const { LogInfo, LogWarning } = require('../logs')

export const COUNTRIES = [
  {
    cId: '57',
    name: 'Colombia',
    code: '57',
    region: 'CO'
  }
]

exports.up = async (queryInterface, schemaName) => {
  try {
    await queryInterface.bulkInsert(
      {
        schema: schemaName,
        tableName: MODEL_COUNTRIES_NAME
      },
      COUNTRIES.map((country) => ({
        cId: uuidv4(), // Aquí puedes colocar un UUID único o generarlo dinámicamente.
        cName: country.name, // Cambia según la estructura de tus datos.
        cCalCod: country.code, // Cambia según la estructura de tus datos.
        cState: 1,
        cDatCre: new Date(),
        cDatMod: new Date()
      })),
      {}
    )
    LogInfo('Países insertados correctamente.')
  } catch (error) {
    LogWarning(error)
  }
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.bulkDelete(
    {
      schema: schemaName,
      tableName: MODEL_COUNTRIES_NAME
    },
    null,
    {}
  )
  LogWarning('Países eliminados correctamente.')
}
