const { BOOLEAN } = require('sequelize')

const { SHOPPING_CARD_MODEL } = require('../../models/Store/ShoppingCard')

/**
 * Agrega la columna `free` a la tabla de líneas de venta (`shoppingcards`).
 *
 * Marca un producto como cortesía/gratis. Cuando es true, el resolver
 * `registerSalesStore` registra la línea con `priceProduct = 0`, de modo que
 * el producto no suma en contaduría, reportes, venta del día ni venta general
 * de la tienda, sin importar el precio real (`ProPrice`) del producto.
 *
 * Es idempotente: si la columna ya existe en el schema del tenant, no hace
 * nada. Se ejecuta por cada tenant (schema) mediante el runner de Umzug.
 */
exports.up = async (queryInterface, schemaName) => {
  const table = { tableName: SHOPPING_CARD_MODEL, schema: schemaName }

  const description = await queryInterface.describeTable(table)
  if (description && description.free) {
    return
  }

  await queryInterface.addColumn(table, 'free', {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
}

/**
 * Elimina la columna `free` si existe. Reversible de forma segura porque la
 * columna solo marca cortesías; no contiene información monetaria por sí misma.
 */
exports.down = async (queryInterface, schemaName) => {
  const table = { tableName: SHOPPING_CARD_MODEL, schema: schemaName }

  const description = await queryInterface.describeTable(table)
  if (description && description.free) {
    await queryInterface.removeColumn(table, 'free')
  }
}
