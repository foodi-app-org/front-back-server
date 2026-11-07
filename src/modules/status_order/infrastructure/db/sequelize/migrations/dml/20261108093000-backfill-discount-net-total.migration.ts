import { QueryInterface, QueryTypes, Transaction } from 'sequelize'

import { STATUS_ORDER_MODEL } from '../../models/sequelize-status_orders.model'

/**
 * Backfill migration for the structured discount + net-total columns on
 * `orders_statuses` (`discountType`, `discountValue`, `discountAmount`,
 * `netTotal`).
 *
 * Context:
 * Historically the global sale discount was stored ONLY in the legacy
 * `discount` column (an INTEGER interpreted as a PERCENTAGE on the read path —
 * see `resolveDiscountPercent` in the order resolver). Older rows may even hold
 * the literal `"[object Object]"` because a `{ type, value }` object was once
 * coerced into the INTEGER column. None of the aggregated accounting figures
 * (day total, general total, reports, dashboard) subtracted that discount.
 *
 * Now that the aggregates read `netTotal` (with a COALESCE fallback to
 * `totalProductsPrice`), this migration reconstructs the net income for every
 * historical row so reports stop over-counting revenue by the discount amount.
 *
 * Per-row reconstruction (same definition the resolver writes at sale time):
 *   gross          = totalProductsPrice                     (base + extras, gross)
 *   discountPercent = legacy `discount` interpreted as a percent, clamped 0-100
 *   discountAmount = round(gross * discountPercent / 100), capped to gross
 *   netTotal       = max(0, gross - discountAmount)
 *   discountType   = 'PERCENT' when a positive percent was found, else NULL
 *   discountValue  = the clamped percent (0-100) when positive, else NULL
 *
 * Safety / idempotency:
 *  - Only rows where `netTotal IS NULL` are candidates, so re-running is a
 *    no-op and rows already written at sale time (or by a prior run) are never
 *    touched.
 *  - `netTotal` is ALWAYS written for a candidate (even when there is no
 *    discount: netTotal = gross), so every processed row drops out of the
 *    candidate set on the next pass.
 *  - Legacy `discount` values that cannot be parsed as a finite number (e.g.
 *    "[object Object]") are treated as 0 discount: netTotal = gross. This is
 *    the historical effective behavior for aggregates (they never subtracted a
 *    non-numeric discount) so no revenue figure changes unexpectedly.
 *  - Processed in bounded, keyset-paginated batches ordered by the primary key.
 */

const BATCH_SIZE = 500

/** Schema-qualified, quoted table reference (SQLite emulates tenant schemas as
 *  a `"<schema>.<table>"` prefix, matching the repositories/migrations). */
const table = (schemaName: string, name: string): string => `"${schemaName}.${name}"`

interface CandidateRow {
  stPId: string
  gross: number | string | null
  legacyDiscount: number | string | null
}

/**
 * Interpret the legacy `discount` column as a percentage (0-100).
 * Returns 0 for null / non-numeric / negative values.
 */
const toLegacyPercent = (raw: unknown): number => {
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return 0
  return Math.min(100, n)
}

export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const sequelize = queryInterface.sequelize

  // Guard: if the columns do not exist yet (DDL not applied on this schema),
  // skip silently. The DDL migration runs before DML in runMigrations, but this
  // keeps the migration safe if executed in isolation.
  try {
    const columns = await queryInterface.describeTable({ tableName: STATUS_ORDER_MODEL, schema: schemaName })
    if (!columns || !Object.prototype.hasOwnProperty.call(columns, 'netTotal')) {
      return
    }
  } catch {
    return
  }

  let processed = 0
  let withDiscount = 0
  let lastKey = ''

  for (;;) {
    const candidates = await sequelize.query<CandidateRow>(
      `
      SELECT
        o."stPId" AS "stPId",
        o."totalProductsPrice" AS "gross",
        o."discount" AS "legacyDiscount"
      FROM ${table(schemaName, STATUS_ORDER_MODEL)} o
      WHERE o."netTotal" IS NULL
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

    await sequelize.transaction(async (t: Transaction) => {
      for (const row of candidates) {
        processed += 1
        lastKey = row.stPId

        const gross = Number(row.gross ?? 0)
        const safeGross = Number.isFinite(gross) && gross > 0 ? gross : 0

        const percent = toLegacyPercent(row.legacyDiscount)
        const discountAmount = percent > 0
          ? Math.min(safeGross, Math.round((safeGross * percent) / 100))
          : 0
        const netTotal = Math.max(0, safeGross - discountAmount)

        const hasDiscount = percent > 0 && discountAmount > 0
        if (hasDiscount) withDiscount += 1

        await sequelize.query(
          `
          UPDATE ${table(schemaName, STATUS_ORDER_MODEL)}
          SET "netTotal" = :netTotal,
              "discountAmount" = :discountAmount,
              "discountType" = :discountType,
              "discountValue" = :discountValue,
              "updatedAt" = :now
          WHERE "stPId" = :stPId
            AND "netTotal" IS NULL;
          `,
          {
            type: QueryTypes.UPDATE,
            replacements: {
              netTotal,
              discountAmount,
              discountType: hasDiscount ? 'PERCENT' : null,
              discountValue: hasDiscount ? percent : null,
              now: new Date(),
              stPId: row.stPId
            },
            transaction: t
          }
        )
      }
    })

    if (candidates.length < BATCH_SIZE) break
  }

  console.log(
    `[backfill discount/netTotal][${schemaName}] processed=${processed} withDiscount=${withDiscount}`
  )
}

/**
 * Data-correction migration: it only fills `netTotal`/discount columns that
 * were NULL and never overwrites values written at sale time. There is no safe
 * deterministic inverse (a NULL netTotal is indistinguishable from one this
 * migration set), so `down` is intentionally a no-op to avoid destroying
 * reconstructed financial data.
 */
export const down = async (
  _queryInterface: QueryInterface,
  _schemaName: string
): Promise<void> => {
  // No-op on purpose: see the note above.
}
