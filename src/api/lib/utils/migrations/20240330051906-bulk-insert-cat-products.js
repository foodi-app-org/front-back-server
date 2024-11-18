import { v4 as uuidv4 } from 'uuid'

const { CATEGORY_PRODUCT_MODEL } = require('../../models/Store/cat')
const { removeTenantPrefix, deCode } = require('../util')
// Lista de elementos a insertar
const categories = [
  { pName: 'Combos' },
  { pName: 'Desayunos' },
  { pName: 'Entradas' },
  { pName: 'Panadería' },
  { pName: 'Sopas' },
  { pName: 'Ensaladas' },
  { pName: 'Platos Fuertes' },
  { pName: 'Acompañamientos' },
  { pName: 'Menú Infantil' },
  { pName: 'Postres' },
  { pName: 'Bebidas' },
  { pName: 'NINGUNO' }
]

// const mappedCategories = categories.map(category => ({
//   pName: category.pName,
//   pState: 1
// }))

const mappedCategories = categories.map((category) => ({
  carProId: uuidv4(), // Genera un UUIDv4 para cada categoría
  pName: category.pName,
  pState: 1
}))
exports.up = async (queryInterface, schemaName) => {
  await queryInterface.bulkInsert(
    {
      schema: schemaName,
      tableName: CATEGORY_PRODUCT_MODEL
    },
    mappedCategories.map((cat) => ({
      ...cat,
      idStore: deCode(removeTenantPrefix(schemaName))
    }))
  )
}

// Para el rollback (down), simplemente eliminamos todos los registros de la tabla
exports.down = async (queryInterface, schemaName) => {
  await queryInterface.bulkDelete(
    { tableName: CATEGORY_PRODUCT_MODEL, schema: schemaName }, // Agregamos el esquema aquí
    null,
    {}
  )
}
