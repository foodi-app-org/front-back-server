import { v4 as uuidv4 } from 'uuid'

import { DEPARTMENTS } from '../places'

const { MODEL_DEPARTMENTS_NAME } = require('../../models/information/DepartmentsModel')
const { LogInfo, LogWarning, LogDanger } = require('../logs')

exports.up = async (queryInterface, schemaName) => {
  try {
    const departmentsData = DEPARTMENTS.map((place) => ({
      cId: '57',
      dId: uuidv4(),
      code_dId: place.c_digo_dane_del_departamento,
      dName: place.departamento,
      dState: 1,
      dDatCre: new Date(),
      dDatMod: new Date()
    }))

    // Inserta los datos en la tabla de departamentos
    await queryInterface.bulkInsert(
      {
        schema: schemaName,
        tableName: MODEL_DEPARTMENTS_NAME
      },
      departmentsData
    )

    LogInfo('Departamentos insertados correctamente.')
  } catch (error) {
    LogDanger('Error al insertar departamentos:', error)
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

    LogWarning('Departamentos eliminados correctamente.')
  } catch (error) {
    LogDanger('Error al eliminar departamentos:', error)
  }
}
