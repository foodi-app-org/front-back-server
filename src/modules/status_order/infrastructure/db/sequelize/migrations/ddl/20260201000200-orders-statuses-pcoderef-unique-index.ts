import { QueryInterface } from 'sequelize'

import { STATUS_ORDER_MODEL } from '../../models/sequelize-status_orders.model'

/**
 * Adds a UNIQUE index on `orders_statuses.pCodeRef` per tenant schema.
 *
 * `pCodeRef` is the business key of a sale and the idempotency key sent by the
 * client. The `registerSalesStore` resolver already guards against retries by
 * looking up an existing order with the same `pCodeRef` BEFORE opening the
 * transaction, but that application-level check does not protect against two
 * truly concurrent requests carrying the SAME `pCodeRef` (a race): both can
 * pass the lookup and then both insert. A database UNIQUE constraint is the
 * only guarantee that closes that window — the second INSERT fails and the
 * sale cannot be duplicated.
 *
 * Why a migration (the model already declares `unique: true`):
 * `columnsStatusOrdersStore` sets `pCodeRef: { unique: true }`, but that only
 * materializes the constraint when the table is first created via
 * `createTable`. Tenant schemas provisioned before this change may have the
 * column WITHOUT the unique index, so this DDL backfills it explicitly on
 * every schema.
 *
 * Idempotent & non-destructive:
 *  - The `addIndex` is guarded so re-running it (or running it on a schema that
 *    already has the index) is a no-op instead of an error.
 *  - If an existing schema already contains DUPLICATE `pCodeRef` rows (legacy
 *    data created before idempotency was enforced), creating a UNIQUE index
 *    would fail. In that case we log a warning and skip, so the migration does
 *    NOT block application bootstrap. Those tenants should be de-duplicated
 *    (see `down` / a one-off cleanup) and this migration re-run to enforce the
 *    constraint. No column is dropped or altered.
 */

const INDEX_PCODEREF_UNIQUE = 'uq_orders_statuses_pcoderef'

export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  try {
    await queryInterface.addIndex(
      { tableName: STATUS_ORDER_MODEL, schema: schemaName },
      { fields: ['pCodeRef'], name: INDEX_PCODEREF_UNIQUE, unique: true }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error)
    // Index already present: idempotent no-op.
    if (message.includes('already exists') || message.includes('duplicate key name')) {
      return
    }
    // Pre-existing duplicate pCodeRef values prevent the UNIQUE index. Do not
    // crash the whole migration run (it would block bootstrap for every
    // schema); surface a warning so the offending tenant can be cleaned up and
    // the migration re-run to enforce the constraint.
    if (message.includes('duplicate') || message.includes('unique')) {
      // eslint-disable-next-line no-console
      console.warn(
        `[migration] Could not create UNIQUE index on ${schemaName}.${STATUS_ORDER_MODEL}.pCodeRef: ` +
        `duplicate values exist. De-duplicate and re-run. Original: ${error instanceof Error ? error.message : String(error)}`
      )
      return
    }
    throw error
  }
}

export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  try {
    await queryInterface.removeIndex(
      { tableName: STATUS_ORDER_MODEL, schema: schemaName },
      INDEX_PCODEREF_UNIQUE
    )
  } catch {
    // Index missing: nothing to remove.
  }
}
