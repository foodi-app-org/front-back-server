import { QueryInterface } from 'sequelize'

import { STATUS_ORDER_MODEL } from '../../models/sequelize-status_orders.model'

/**
 * Adds the indexes that back the sales metrics now that they read the header
 * directly:
 *   - `findTotalSales` / `findTotalSalesSold`: INNER JOIN on `idStatus` +
 *     filter on the status type, then SUM/COUNT over orders.
 *   - `countSalesAmountToday`: same join + a `createdAt` range filter.
 *
 * Indexes:
 *   - idStatus : speeds up the join to `order_status_types` and the
 *     per-status grouping used by every sales aggregate.
 *   - createdAt: supports the "sales of the day" range scan.
 *
 * Note: an index helps the planner prune rows, but a plain
 * `SUM(totalProductsPrice)` over all concluded orders is still O(rows matched);
 * it is not O(1). For very large histories the documented next step is a daily
 * sales rollup / metrics table (see the task write-up), which is intentionally
 * NOT implemented here because the current volume does not require it.
 *
 * Idempotent: each `addIndex` is guarded so re-running the migration (or
 * running it on a schema that already has the index) is a no-op instead of an
 * error. No column is dropped or altered, so this is non-destructive.
 */

const INDEX_CREATED_AT = 'idx_orders_statuses_created_at'
const INDEX_ID_STATUS = 'idx_orders_statuses_id_status'

const addIndexSafe = async (
  queryInterface: QueryInterface,
  schemaName: string,
  fields: string[],
  name: string
): Promise<void> => {
  try {
    await queryInterface.addIndex(
      { tableName: STATUS_ORDER_MODEL, schema: schemaName },
      { fields, name }
    )
  } catch (error) {
    // Index already exists (or the dialect reports a duplicate): treat as a
    // no-op to keep the migration idempotent. Any other failure is re-thrown.
    const message = error instanceof Error ? error.message.toLowerCase() : String(error)
    if (!message.includes('already exists') && !message.includes('duplicate')) {
      throw error
    }
  }
}

export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await addIndexSafe(queryInterface, schemaName, ['createdAt'], INDEX_CREATED_AT)
  await addIndexSafe(queryInterface, schemaName, ['idStatus'], INDEX_ID_STATUS)
}

export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  for (const name of [INDEX_CREATED_AT, INDEX_ID_STATUS]) {
    try {
      await queryInterface.removeIndex(
        { tableName: STATUS_ORDER_MODEL, schema: schemaName },
        name
      )
    } catch {
      // Index missing: nothing to remove.
    }
  }
}
