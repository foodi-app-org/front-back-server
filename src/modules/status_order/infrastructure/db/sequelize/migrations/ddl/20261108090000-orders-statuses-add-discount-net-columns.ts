import { DECIMAL, INTEGER, QueryInterface, STRING } from 'sequelize'

import { STATUS_ORDER_MODEL } from '../../models/sequelize-status_orders.model'

/**
 * Adds the structured discount + net-total columns to `orders_statuses` per
 * tenant schema:
 *   - discountType   (STRING)  → 'PERCENT' | 'AMOUNT' at sale time.
 *   - discountValue  (INTEGER) → user-entered figure (percent 0-100 or amount).
 *   - discountAmount (DECIMAL) → money actually discounted (computed at sale).
 *   - netTotal       (DECIMAL) → totalProductsPrice - discountAmount (income).
 *
 * Why these columns:
 * Until now the global sale discount was NOT reflected in any aggregated
 * accounting figure. `totalProductsPrice` is the GROSS total (base + extras,
 * free lines already zeroed) and every aggregate (day total, general total,
 * reports, dashboard) summed it without subtracting the discount, while only
 * the single-sale detail applied it. `netTotal` is the new authoritative
 * income read by the aggregates (with a COALESCE fallback to
 * `totalProductsPrice` for legacy rows until the backfill runs).
 *
 * The legacy `discount` (INTEGER) column is intentionally left untouched for
 * backward-compatible reads; the new columns are additive.
 *
 * Why a migration (the model already declares the columns):
 * `columnsStatusOrdersStore` now includes these columns, but that only
 * materializes when a schema's table is first created via `createTable`.
 * Tenant schemas provisioned before this change have the table WITHOUT the
 * columns, so this DDL backfills the structure on every existing schema.
 *
 * Idempotent & non-destructive:
 *  - Guarded with `describeTable`; adding a column that already exists is a
 *    safe no-op.
 *  - All columns are nullable, so existing rows stay valid (the DML backfill
 *    populates `discountAmount`/`netTotal` afterwards).
 */

interface ColumnSpec {
  name: string
  definition: Parameters<QueryInterface['addColumn']>[2]
}

const COLUMNS: ColumnSpec[] = [
  { name: 'discountType', definition: { type: STRING(16), allowNull: true } },
  { name: 'discountValue', definition: { type: INTEGER, allowNull: true } },
  { name: 'discountAmount', definition: { type: DECIMAL(1000, 2), allowNull: true } },
  { name: 'netTotal', definition: { type: DECIMAL(1000, 2), allowNull: true } }
]

export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const table = { tableName: STATUS_ORDER_MODEL, schema: schemaName }

  let existing: Record<string, unknown>
  try {
    existing = await queryInterface.describeTable(table)
  } catch {
    // Table does not exist yet: it will be created by the create-table
    // migration (which already includes these columns via
    // columnsStatusOrdersStore), so there is nothing to add here.
    return
  }

  for (const column of COLUMNS) {
    if (existing && Object.prototype.hasOwnProperty.call(existing, column.name)) {
      // Column already present: idempotent no-op.
      continue
    }
    await queryInterface.addColumn(table, column.name, column.definition)
  }
}

export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const table = { tableName: STATUS_ORDER_MODEL, schema: schemaName }
  for (const column of COLUMNS) {
    try {
      await queryInterface.removeColumn(table, column.name)
    } catch {
      // Column missing: nothing to remove.
    }
  }
}
