const { QueryTypes } = require('sequelize')

const { generateEAN13Barcode } = require('../generateEAN13Barcode.js')

const PRODUCT_TABLE = 'productmodelfoods'

/**
 * Backfill de códigos de barras para productos existentes.
 *
 * Asigna un EAN-13 de USO INTERNO (prefijo 2) válido y único a todo producto
 * que aún no tenga `ProBarCode` (null o cadena vacía). Es idempotente: al
 * reejecutarse solo toca los que sigan sin código.
 *
 * Se ejecuta por cada tenant (schema) mediante el runner de Umzug.
 */
exports.up = async (queryInterface, schemaName) => {
  const sequelize = queryInterface.sequelize
  const qualifiedTable = `"${schemaName}"."${PRODUCT_TABLE}"`

  // 1. Productos sin código de barras.
  const pending = await sequelize.query(
    `SELECT "pId" FROM ${qualifiedTable}
     WHERE "ProBarCode" IS NULL OR "ProBarCode" = ''`,
    { type: QueryTypes.SELECT }
  )

  if (!pending || pending.length === 0) {
    return
  }

  // 2. Códigos ya usados en este schema, para garantizar unicidad local sin
  //    depender de ida y vuelta a la BD por cada intento.
  const existingRows = await sequelize.query(
    `SELECT "ProBarCode" AS code FROM ${qualifiedTable}
     WHERE "ProBarCode" IS NOT NULL AND "ProBarCode" <> ''`,
    { type: QueryTypes.SELECT }
  )
  const used = new Set(existingRows.map((row) => `${row.code}`))

  /** Genera un EAN-13 interno que no colisione con los ya usados. */
  const nextUniqueBarcode = () => {
    let code = generateEAN13Barcode()
    let attempts = 0
    while (used.has(code) && attempts < 10) {
      code = generateEAN13Barcode()
      attempts++
    }
    used.add(code)
    return code
  }

  // 3. Asigna y actualiza cada producto pendiente.
  for (const row of pending) {
    const barcode = nextUniqueBarcode()
    await sequelize.query(
      `UPDATE ${qualifiedTable}
       SET "ProBarCode" = :barcode
       WHERE "pId" = :pId`,
      {
        type: QueryTypes.UPDATE,
        replacements: { barcode, pId: row.pId }
      }
    )
  }
}

/**
 * No hay down seguro: borrar los códigos asignados podría eliminar barcodes que
 * el usuario ya imprimió/escaneó. Se deja como no-op intencional.
 */
exports.down = async () => {
  // Intencionalmente vacío: el backfill no es reversible de forma segura.
}
