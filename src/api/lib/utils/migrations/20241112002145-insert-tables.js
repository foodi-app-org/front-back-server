const { v4: uuidv4 } = require('uuid')

const { STORE_TABLES } = require('../../models/storeTables')
const { RandomCode } = require('..')
/**
 * Seed data for store tables
 */
const storeTablesData = [
  { seats: 2, section: null, tableState: 1 },
  { seats: 12, section: null, tableState: 1 },
  { seats: 10, section: null, tableState: 1 },
  { seats: 4, section: null, tableState: 1 },
  { seats: 2, section: null, tableState: 1 },
  { seats: 4, section: null, tableState: 1 },
  { seats: 4, section: null, tableState: 1 },
  { seats: 4, section: null, tableState: 1 },
  { seats: 4, section: null, tableState: 1 },
  { seats: 4, section: null, tableState: 1 }
]

exports.up = async (queryInterface, schemaName) => {
  // Obtener el idStore usando el esquema (teniendo en cuenta el prefijo)

  // Generar y preparar los datos para la inserción
  const tablesDataWithIds = storeTablesData.map((data) => ({
    ...data,
    tableId: uuidv4(),
    tableName: RandomCode(9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))

  // Insertar datos en la tabla
  await queryInterface.bulkInsert(
    { schema: schemaName, tableName: STORE_TABLES },
    tablesDataWithIds
  )
}

exports.down = async (queryInterface, schemaName) => {
  // Eliminar todas las tablas del esquema en caso de rollback
  await queryInterface.bulkDelete(
    { tableName: STORE_TABLES, schema: schemaName },
    null,
    {}
  )
}
