import { QueryInterface } from 'sequelize'

import {
  PRODUCT_MODEL,
  PRODUCT_BARCODE_UNIQUE_INDEX
} from '../../models/sequelize-product.model'

/**
 * Cambia la unicidad del código de barras de GLOBAL a POR TIENDA.
 *
 * Contexto: la columna `ProBarCode` se creó con `unique: true`, lo que genera
 * un índice único de UNA sola columna (unicidad global en el schema). En un
 * sistema multi-tienda eso es incorrecto: dos tiendas distintas deben poder
 * tener el mismo código de barras (p. ej. el EAN de fábrica de un producto
 * comercial), pero NO puede duplicarse dentro de una misma tienda.
 *
 * Esta migración, por cada schema de tenant:
 *  1. Elimina cualquier índice ÚNICO de una sola columna sobre `ProBarCode`
 *     (el viejo índice global, cuyo nombre exacto depende de cómo lo nombró
 *     Sequelize al crear la tabla).
 *  2. Crea un índice ÚNICO COMPUESTO sobre `(idStore, ProBarCode)`.
 *
 * Idempotente y no destructiva:
 *  - No borra ni altera columnas; solo reemplaza índices.
 *  - Re-ejecutarla es un no-op (guardas de "already exists" / "does not exist").
 *  - Si un schema tiene duplicados legados `(idStore, ProBarCode)`, crear el
 *    índice único fallaría; en ese caso se registra un warning y se omite (sin
 *    bloquear el arranque de la app). Esos tenants deben depurarse y re-correr.
 */

interface ShowIndexRow {
  name: string
  unique: boolean
  fields?: Array<{ attribute?: string }>
}

export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const table = { tableName: PRODUCT_MODEL, schema: schemaName }

  // 1. Eliminar el/los índices únicos de una sola columna ProBarCode (global).
  try {
    const indexes = (await queryInterface.showIndex(table)) as unknown as ShowIndexRow[]
    const singleColumnBarcodeUniques = indexes.filter((idx) => {
      const fields = (idx.fields ?? []).map((f) => f?.attribute)
      const isSingleBarcode =
        fields.length === 1 && fields[0] === 'ProBarCode'
      // No tocar el compuesto nuevo aunque incluya ProBarCode.
      return idx.unique && isSingleBarcode && idx.name !== PRODUCT_BARCODE_UNIQUE_INDEX
    })

    for (const idx of singleColumnBarcodeUniques) {
      try {
        await queryInterface.removeIndex(table, idx.name)
      } catch {
        // El índice pudo eliminarse en otra corrida: no es crítico.
      }
    }
  } catch (error) {
    // showIndex puede fallar en algunos dialectos/escenarios; no bloquear.
    // eslint-disable-next-line no-console
    console.warn(
      `[migration] No se pudieron listar índices de ${schemaName}.${PRODUCT_MODEL}: ` +
      `${error instanceof Error ? error.message : String(error)}`
    )
  }

  // 1b. En Postgres, `unique: true` sobre la columna materializa una UNIQUE
  // CONSTRAINT (no un índice suelto), cuyo nombre por defecto es
  // `<tabla>_ProBarCode_key`. `removeIndex` no la elimina, así que intentamos
  // quitarla explícitamente. Es un no-op silencioso si no existe o si el
  // dialecto no la usa (p. ej. MySQL/SQLite).
  try {
    await queryInterface.removeConstraint(table, `${PRODUCT_MODEL}_ProBarCode_key`)
  } catch {
    // La constraint no existe o el dialecto no la maneja así: ignorar.
  }

  // 2. Crear el índice único compuesto (idStore, ProBarCode).
  try {
    await queryInterface.addIndex(table, {
      fields: ['idStore', 'ProBarCode'],
      name: PRODUCT_BARCODE_UNIQUE_INDEX,
      unique: true
    })
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error)
    // Índice ya presente: no-op idempotente.
    if (message.includes('already exists') || message.includes('duplicate key name')) {
      return
    }
    // Duplicados legados (idStore, ProBarCode) impiden el índice único. No
    // romper el arranque de todos los schemas; avisar para depurar y re-correr.
    if (message.includes('duplicate') || message.includes('unique')) {
      // eslint-disable-next-line no-console
      console.warn(
        `[migration] No se pudo crear el índice único ${PRODUCT_BARCODE_UNIQUE_INDEX} en ` +
        `${schemaName}.${PRODUCT_MODEL}: existen valores duplicados (idStore, ProBarCode). ` +
        `Depura y re-ejecuta. Original: ${error instanceof Error ? error.message : String(error)}`
      )
      return
    }
    throw error
  }
}

/**
 * Revierte el cambio: elimina el índice compuesto. No restaura el índice único
 * global porque podría fallar si hay el mismo código en varias tiendas (el
 * estado correcto del nuevo modelo); por eso el rollback solo quita el índice
 * compuesto.
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  try {
    await queryInterface.removeIndex(
      { tableName: PRODUCT_MODEL, schema: schemaName },
      PRODUCT_BARCODE_UNIQUE_INDEX
    )
  } catch {
    // Índice ausente: nada que revertir.
  }
}
