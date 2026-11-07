import { BOOLEAN, QueryInterface } from 'sequelize'

import { SHOPPING_CART_MODEL } from '../../models/sequelize-shopping-cart.model'

/**
 * Adds the `free` (courtesy) column to `shopping_carts` per tenant schema.
 *
 * A product sold as a gift is marked `free = true` by the POS. The
 * `registerSalesStore` resolver then persists `priceProduct = 0` for that line
 * (product and complementos), so the gift is excluded from accounting,
 * reports, daily sales and the store's general sales. The column itself stores
 * the flag for traceability / reprints and lets downstream logic tell a true
 * zero-priced sale from a courtesy.
 *
 * Why a migration (the model already declares the column):
 * `columnsShoppingCart` now includes `free`, but that only materializes when a
 * schema's table is first created via `createTable`. Tenant schemas
 * provisioned before this change have the table WITHOUT the column, so this
 * DDL backfills it on every existing schema.
 *
 * Idempotent & non-destructive:
 *  - Guarded with `describeTable` so re-running it (or running it on a schema
 *    that already has the column) is a safe no-op.
 *  - `allowNull: false` with `defaultValue: false` backfills existing rows as
 *    non-courtesy, preserving the historical behavior (no sale changes value).
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const table = { tableName: SHOPPING_CART_MODEL, schema: schemaName }
  try {
    const columns = await queryInterface.describeTable(table)
    if (columns && Object.prototype.hasOwnProperty.call(columns, 'free')) {
      // Column already present: idempotent no-op.
      return
    }
  } catch {
    // If the table does not exist yet it will be created by the create-table
    // migration (which already includes `free` via columnsShoppingCart), so
    // there is nothing to add here.
    return
  }

  await queryInterface.addColumn(table, 'free', {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
}

export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const table = { tableName: SHOPPING_CART_MODEL, schema: schemaName }
  try {
    await queryInterface.removeColumn(table, 'free')
  } catch {
    // Column missing: nothing to remove.
  }
}
