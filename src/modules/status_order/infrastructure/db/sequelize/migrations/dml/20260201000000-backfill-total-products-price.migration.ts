import { QueryInterface, QueryTypes, Transaction } from 'sequelize'

import { SHOPPING_CART_MODEL } from '../../../../../../shopping/infrastructure/db/sequelize/models/sequelize-shopping-cart.model'
import { EXTRA_PRODUCT_MODEL_SOLD } from '../../../../../../product_extra/infrastructure/db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra-sold.model'
import { STATUS_ORDER_MODEL } from '../../models/sequelize-status_orders.model'

/**
 * Backfill migration for `orders_statuses.totalProductsPrice`.
 *
 * Historical orders were persisted with `totalProductsPrice = 0` because the
 * old `registerSalesStore` flow asked `sumPrice` for the total AFTER the sale
 * (outside the write transaction, and ignoring sold extras). Now that the
 * header is the single source of truth for the sales metrics
 * (`findTotalSales`, `countSalesAmountToday`), those historical rows must be
 * reconstructed from their own line items.
 *
 * Per-order total (same definition the resolver now writes at sale time, and
 * the metrics used to reconstruct):
 *   base  = SUM(shopping_carts.priceProduct * COALESCE(cantProducts, 1))
 *           matched by shoppingCartRefCode
 *   extra = SUM(products_extras_sold.extraPrice * COALESCE(quantity, 1))
 *           matched by pCodeRef
 *   total = base + extra
 *
 * Safety / idempotency:
 *  - Only rows whose header is currently 0 or NULL are considered candidates.
 *    Rows that already carry a correct total are never touched.
 *  - The computed total is written ONLY when it is strictly greater than 0, so
 *    a legitimate zero sale (no base, no extras) is left untouched and running
 *    the migration again is a no-op (after the first run those rows either hold
 *    the correct positive value, or stay at 0 because they genuinely sum 0).
 *  - Historical prices come from the sale's own line items
 *    (`shopping_carts` / `products_extras_sold`), never from the current
 *    product catalog, so already-registered sales keep their real amounts.
 *  - Order status is NOT filtered: the header total is a property of the sale's
 *    lines regardless of its lifecycle state, and correcting it does not change
 *    which orders the metrics count (metrics still apply their own state = 4
 *    filter on top of the header).
 *  - Processed in stable, bounded batches (ordered by primary key) to avoid
 *    loading the whole history in memory and to keep each transaction small.
 *    The loop can be safely re-run / resumed; already-corrected rows drop out
 *    of the candidate set automatically.
 */

const BATCH_SIZE = 500

/** Builds a schema-qualified, quoted table reference (SQLite emulates the
 * tenant schema as a `"<schema>.<table>"` prefix, matching the repositories). */
const table = (schemaName: string, name: string): string => `"${schemaName}.${name}"`

interface CandidateRow {
  stPId: string
  shoppingCartRefCode: string | null
  pCodeRef: string | null
  computedTotal: number | string | null
}

export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const sequelize = queryInterface.sequelize

  let processed = 0
  let corrected = 0
  let skipped = 0
  let lastKey = ''

  // Keyset pagination over the primary key `stPId`: stable even while rows are
  // being updated, and avoids large OFFSET scans. Each iteration fetches a
  // bounded batch of candidate orders (header total 0/NULL) together with the
  // total reconstructed from their line items.
  for (;;) {
    const candidates = await sequelize.query<CandidateRow>(
      `
      SELECT
        o."stPId" AS "stPId",
        o."shoppingCartRefCode" AS "shoppingCartRefCode",
        o."pCodeRef" AS "pCodeRef",
        (
          COALESCE((
            SELECT SUM(sc."priceProduct" * COALESCE(sc."cantProducts", 1))
            FROM ${table(schemaName, SHOPPING_CART_MODEL)} sc
            WHERE sc."shoppingCartRefCode" = o."shoppingCartRefCode"
          ), 0)
          +
          COALESCE((
            SELECT SUM(es."extraPrice" * COALESCE(es."quantity", 1))
            FROM ${table(schemaName, EXTRA_PRODUCT_MODEL_SOLD)} es
            WHERE es."pCodeRef" = o."pCodeRef"
          ), 0)
        ) AS "computedTotal"
      FROM ${table(schemaName, STATUS_ORDER_MODEL)} o
      WHERE (o."totalProductsPrice" IS NULL OR o."totalProductsPrice" = 0)
        AND o."stPId" > :lastKey
      ORDER BY o."stPId" ASC
      LIMIT :batchSize;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { lastKey, batchSize: BATCH_SIZE }
      }
    )

    if (candidates.length === 0) break

    // Apply each batch in its own small transaction so an interruption only
    // loses the current batch; already-committed corrections survive and the
    // candidate filter skips them on the next run.
    await sequelize.transaction(async (t: Transaction) => {
      for (const row of candidates) {
        processed += 1
        lastKey = row.stPId

        const computed = Number(row.computedTotal ?? 0)
        // Only overwrite when we reconstructed a strictly positive amount. A
        // zero result means either no line items or a genuine zero sale; in
        // both cases we must not touch the row (keeps legitimate zeros and
        // makes the migration idempotent).
        if (!Number.isFinite(computed) || computed <= 0) {
          skipped += 1
          continue
        }

        await sequelize.query(
          `
          UPDATE ${table(schemaName, STATUS_ORDER_MODEL)}
          SET "totalProductsPrice" = :total,
              "updatedAt" = :now
          WHERE "stPId" = :stPId
            AND ("totalProductsPrice" IS NULL OR "totalProductsPrice" = 0);
          `,
          {
            type: QueryTypes.UPDATE,
            replacements: { total: computed, now: new Date(), stPId: row.stPId },
            transaction: t
          }
        )
        corrected += 1
      }
    })

    // A short batch means we reached the end of the candidate set.
    if (candidates.length < BATCH_SIZE) break
  }

  console.log(
    `[backfill totalProductsPrice][${schemaName}] processed=${processed} corrected=${corrected} skipped=${skipped}`
  )
}

/**
 * This is a data-correction migration: it only fills in totals that were left
 * at 0/NULL and never overwrites a previously valid value, so there is no safe,
 * deterministic inverse. `down` is intentionally a no-op to avoid destroying
 * reconstructed financial data.
 */
export const down = async (
  _queryInterface: QueryInterface,
  _schemaName: string
): Promise<void> => {
  // No-op on purpose: see the note above. Reverting would zero-out legitimate
  // totals that cannot be distinguished from the ones this migration fixed.
}
