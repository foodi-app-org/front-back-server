/**
 * @file report-data.helpers.ts
 * @description Pure, dependency-free helpers for report data shaping. Kept
 * separate from `report-data.service.ts` so they can be unit-tested without
 * loading the Sequelize/DB layer.
 */

/** Aggregated base-product sales line (revenue excludes extras). */
export interface SalesProductAggregate {
  product: string | null
  units: number | string | null
  total: number | string | null
}

/** Aggregated sold-extra line, carrying its parent product name. */
export interface SalesExtraAggregate {
  product: string | null
  parent: string | null
  units: number | string | null
  total: number | string | null
}

/** A combined sales-by-product row with type/parent discrimination. */
export interface SalesByProductRow {
  // Index signature so rows are assignable to the exporter's generic row shape.
  [key: string]: string | number | boolean | null
  type: 'Producto' | 'Complemento'
  product: string
  parent: string
  units: number
  total: number
}

/**
 * Combines base-product and sold-extra aggregates into the final
 * sales-by-product rows (Option A). Pure and DB-independent so the
 * no-double-counting rule is unit-testable.
 *
 * Invariants:
 * - Base product revenue (`sc.priceProduct * cantProducts`) NEVER includes
 *   extras, so extra lines are purely additive and never duplicate income
 *   already counted on the parent product row.
 * - Extras are emitted as independent rows (`type = 'Complemento'`) with their
 *   `parent` product name for traceability.
 * - The combined set is ranked by units desc; `limit` (topProducts) is applied
 *   AFTER merging so the ranking spans products and extras together.
 *
 * @param productRows - Base product aggregates.
 * @param extraRows - Sold-extra aggregates.
 * @param limit - Optional cap for the top ranking.
 * @returns Ordered, discriminated rows ready for export.
 */
export const combineSalesByProductRows = (
  productRows: SalesProductAggregate[],
  extraRows: SalesExtraAggregate[],
  limit?: number
): SalesByProductRow[] => {
  const allRows: SalesByProductRow[] = [
    ...productRows.map((r) => ({
      type: 'Producto' as const,
      product: r.product ?? 'Producto',
      parent: '',
      units: Number(r.units ?? 0),
      total: Number(r.total ?? 0)
    })),
    ...extraRows.map((r) => ({
      type: 'Complemento' as const,
      product: r.product ?? 'Complemento',
      parent: r.parent ?? '',
      units: Number(r.units ?? 0),
      total: Number(r.total ?? 0)
    }))
  ]

  allRows.sort((a, b) => b.units - a.units)
  return limit ? allRows.slice(0, limit) : allRows
}

/**
 * Model/table names needed to build report SQL. Injected so the same SQL used
 * in production can be exercised verbatim by integration tests against a
 * controlled database.
 */
export interface ReportSqlModels {
  PRODUCT_MODEL: string
  PRODUCT_MODEL_SOLD: string
  EXTRA_PRODUCT_MODEL: string
  EXTRA_PRODUCT_MODEL_SOLD: string
  SHOPPING_CART_MODEL: string
  STATUS_ORDER_MODEL: string
  ORDER_STATUS_TYPE_MODEL: string
}

/**
 * Builders for the report SQL statements. Centralized here (pure strings) so
 * the ReportDataService and the integration tests use the EXACT same SQL,
 * preventing drift between what is tested and what runs in production.
 *
 * `t` is the schema-qualified prefix (e.g. `public` or `tenant_<id>`). The
 * active-state (1) rule is applied ONLY to current-inventory reports, never to
 * historical sales reports.
 */
export const reportSql = {
  /** CURRENT inventory: active products + active extras, both managing stock. */
  inventoryCurrentProducts: (t: string, m: ReportSqlModels): string => `
      SELECT "pCode" AS "code", "pName" AS "name", "stock" AS "stock", "ProPrice" AS "price"
      FROM "${t}.${m.PRODUCT_MODEL}"
      WHERE "manageStock" = true AND "pState" = :active
      ORDER BY "pName" ASC;
      `,
  inventoryCurrentExtras: (t: string, m: ReportSqlModels): string => `
      SELECT "exPid" AS "code", "extraName" AS "name", "stock" AS "stock", "extraPrice" AS "price"
      FROM "${t}.${m.EXTRA_PRODUCT_MODEL}"
      WHERE "manageStock" = true AND "exState" = :active
      ORDER BY "extraName" ASC;
      `,
  /** CATALOG: all products / all extras (active and inactive, flagged). */
  catalogProducts: (t: string, m: ReportSqlModels): string => `
      SELECT "pCode" AS "code", "pName" AS "name", "ProPrice" AS "price",
             "vat" AS "vat", "stock" AS "stock", "manageStock" AS "manageStock", "pState" AS "pState"
      FROM "${t}.${m.PRODUCT_MODEL}"
      ORDER BY "pName" ASC;
      `,
  catalogExtras: (t: string, m: ReportSqlModels): string => `
      SELECT "exPid" AS "code", "extraName" AS "name", "extraPrice" AS "price",
             "stock" AS "stock", "manageStock" AS "manageStock", "exState" AS "exState"
      FROM "${t}.${m.EXTRA_PRODUCT_MODEL}"
      ORDER BY "extraName" ASC;
      `,
  /** LOW STOCK: active products / active extras, managing stock, at/under threshold. */
  lowStockProducts: (t: string, m: ReportSqlModels): string => `
      SELECT "pCode" AS "code", "pName" AS "name", "stock" AS "stock"
      FROM "${t}.${m.PRODUCT_MODEL}"
      WHERE "manageStock" = true AND "pState" = :active AND "stock" <= :threshold
      ORDER BY "stock" ASC;
      `,
  lowStockExtras: (t: string, m: ReportSqlModels): string => `
      SELECT "exPid" AS "code", "extraName" AS "name", "stock" AS "stock"
      FROM "${t}.${m.EXTRA_PRODUCT_MODEL}"
      WHERE "manageStock" = true AND "exState" = :active AND "stock" <= :threshold
      ORDER BY "stock" ASC;
      `,
  /** HISTORICAL sales by base product (no current-state filter). */
  salesByProductBase: (t: string, m: ReportSqlModels): string => `
      SELECT
        COALESCE(ps."pName", 'Producto') AS "product",
        COALESCE(SUM(sc."cantProducts"), 0) AS "units",
        COALESCE(SUM(sc."priceProduct" * sc."cantProducts"), 0) AS "total"
      FROM "${t}.${m.STATUS_ORDER_MODEL}" o
      INNER JOIN "${t}.${m.ORDER_STATUS_TYPE_MODEL}" ty ON o."idStatus" = ty."idStatus"
      INNER JOIN "${t}.${m.SHOPPING_CART_MODEL}" sc ON sc."shoppingCartRefCode" = o."shoppingCartRefCode"
      LEFT JOIN "${t}.${m.PRODUCT_MODEL_SOLD}" ps ON ps."pId" = sc."pId"
      WHERE ty."state" = :concluded
        AND o."createdAt" >= :startAt AND o."createdAt" < :endAt
      GROUP BY "product"
      ORDER BY "units" DESC;
      `,
  /** HISTORICAL sales by sold extra (independent lines, no current-state filter). */
  salesByProductExtras: (t: string, m: ReportSqlModels): string => `
      SELECT
        COALESCE(es."extraName", 'Complemento') AS "product",
        COALESCE(ps."pName", '') AS "parent",
        COALESCE(SUM(es."quantity"), 0) AS "units",
        COALESCE(SUM(es."extraPrice" * es."quantity"), 0) AS "total"
      FROM "${t}.${m.STATUS_ORDER_MODEL}" o
      INNER JOIN "${t}.${m.ORDER_STATUS_TYPE_MODEL}" ty ON o."idStatus" = ty."idStatus"
      INNER JOIN "${t}.${m.EXTRA_PRODUCT_MODEL_SOLD}" es ON es."pCodeRef" = o."pCodeRef"
      LEFT JOIN "${t}.${m.PRODUCT_MODEL_SOLD}" ps ON ps."pId" = es."pId"
      WHERE ty."state" = :concluded
        AND o."createdAt" >= :startAt AND o."createdAt" < :endAt
      GROUP BY "product", "parent"
      ORDER BY "units" DESC;
      `
}
