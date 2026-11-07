
import { QueryTypes } from 'sequelize'

import { CATEGORY_PRODUCT_MODEL } from '../../../category_products/infrastructure/db/sequelize/models/sequelize-model'
import { CLIENTS_TABLE } from '../../../clients/infrastructure/db/sequelize/models/sequelize-table.model'
import { PRODUCT_MODEL } from '../../../products/infrastructure/db/sequelize/models/sequelize-product.model'
import { PRODUCT_MODEL_SOLD } from '../../../products/infrastructure/db/sequelize/models/sequelize-product-sold.model'
import { EXTRA_PRODUCT_MODEL_SOLD } from '../../../product_extra/infrastructure/db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra-sold.model'
import { SHOPPING_CART_MODEL } from '../../../shopping/infrastructure/db/sequelize/models/sequelize-shopping-cart.model'
import { STATUS_ORDER_MODEL } from '../../../status_order/infrastructure/db/sequelize/models/sequelize-status_orders.model'
import { ORDER_STATUS_TYPE_MODEL } from '../../../status_order_types/infrastructure/db/sequelize/models/sequelize-status_orders_types.model'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import {
  enumerateBuckets,
  getBucketKey,
  getPreviousPeriodRange,
  resolveGranularity,
  toStoredUtcFormat
} from '../../../../shared/utils/period-range.utils'
import { buildKpiMetric, roundMoney } from '../../application/kpi.math'
import { RECENT_ORDERS_SORT_ALLOWLIST } from '../../application/filters.validator'
import {
  CategorySalesSlice,
  DashboardFilter,
  DashboardSummary,
  IDashboardCommercialRepository,
  RecentOrdersPage,
  RecentOrderRow,
  SalesByCategory,
  SalesTrend,
  TopProductSale,
  TrendPoint
} from '../../domain/types'

/** A completed order (CONCLUIDA) has `order_status_types.state = 4`. */
const ORDER_STATE_CONCLUDED = 4

/** Active client state (`clients.clState = 1`). */
const CLIENT_STATE_ACTIVE = 1

/** Active product state (`product_models.pState = 1`). */
const PRODUCT_STATE_ACTIVE = 1

/** Hard cap for the top-products ranking. */
const TOP_PRODUCTS_LIMIT = 10

/** Category bucket used when a product has no category. */
const UNCATEGORIZED = 'Sin categoría'

type OrderRow = {
  createdAt: string | Date
  total: number | string | null
}

/**
 * Normalizes a DB `createdAt` value into an ISO-8601 UTC string.
 */
const normalizeToIso = (value: string | Date): string => {
  if (value instanceof Date) return value.toISOString()

  const raw = String(value).trim()
  const normalized = raw
    .replace(' ', 'T')
    .replace(' +00:00', 'Z')
    .replace('+00:00', 'Z')

  const parsed = new Date(normalized)

  return Number.isNaN(parsed.getTime())
    ? raw
    : parsed.toISOString()
}

/**
 * Sequelize-backed implementation of the commercial dashboard aggregations.
 *
 * Financial rules:
 *
 * - totalProductsPrice: gross sale value, before discount.
 * - discountAmount: actual monetary discount.
 * - netTotal: final sale value after discount.
 *
 * For new orders, netTotal is the authoritative source of revenue.
 * For legacy orders without netTotal, revenue is reconstructed from
 * line items and discountAmount.
 *
 * Category and product reports allocate the order discount proportionally
 * across their corresponding gross revenue.
 */
export class SequelizeDashboardCommercialRepository
implements IDashboardCommercialRepository {
  private readonly tenant: string

  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  /** @returns The shared Sequelize instance, or throws when unavailable. */
  private getSequelize() {
    const sequelize = models.Product.sequelize

    if (!sequelize) {
      throw new Error('Sequelize instance is not available')
    }

    return sequelize
  }

  /** @returns Fully-qualified, quoted tenant table identifier. */
  private table(name: string): string {
    return `"${this.tenant}.${name}"`
  }

  /**
   * Loads completed orders (one row per order) within a half-open range.
   *
   * Revenue uses:
   * 1. netTotal when available.
   * 2. Gross total minus discountAmount for legacy orders.
   *
   * The gross fallback includes both products and sold extras.
   */
  private async loadOrdersInRange(
    startAt: string,
    endAt: string
  ): Promise<OrderRow[]> {
    const sequelize = this.getSequelize()

    return sequelize.query<OrderRow>(
      `
      WITH order_totals AS (
        SELECT
          o."createdAt" AS "createdAt",
          o."netTotal" AS "netTotal",
          COALESCE(o."discountAmount", 0) AS "discountAmount",

          COALESCE(
            NULLIF(o."totalProductsPrice", 0),

            -- Base products.
            COALESCE((
              SELECT SUM(
                COALESCE(sc."priceProduct", 0) *
                COALESCE(sc."cantProducts", 1)
              )
              FROM ${this.table(SHOPPING_CART_MODEL)} sc
              WHERE sc."shoppingCartRefCode" = o."shoppingCartRefCode"
            ), 0)

            +

            -- Sold extras.
            COALESCE((
              SELECT SUM(
                COALESCE(es."extraPrice", 0) *
                COALESCE(es."quantity", 1)
              )
              FROM ${this.table(EXTRA_PRODUCT_MODEL_SOLD)} es
              WHERE es."pCodeRef" = o."pCodeRef"
            ), 0),

            0
          ) AS "grossTotal"

        FROM ${this.table(STATUS_ORDER_MODEL)} o
        INNER JOIN ${this.table(ORDER_STATUS_TYPE_MODEL)} t
          ON o."idStatus" = t."idStatus"
        WHERE t."state" = :concluded
          AND o."createdAt" >= :startAt
          AND o."createdAt" < :endAt
      )

      SELECT
        "createdAt",

        CASE
          -- New orders: the persisted net total is authoritative.
          WHEN "netTotal" IS NOT NULL THEN
            CASE
              WHEN "netTotal" < 0 THEN 0
              ELSE "netTotal"
            END

          -- Legacy orders: reconstruct net revenue.
          ELSE
            CASE
              WHEN (
                "grossTotal" - MAX("discountAmount", 0)
              ) > 0
                THEN "grossTotal" - MAX("discountAmount", 0)
              ELSE 0
            END
        END AS "total"

      FROM order_totals;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          concluded: ORDER_STATE_CONCLUDED,
          startAt: toStoredUtcFormat(startAt),
          endAt: toStoredUtcFormat(endAt)
        }
      }
    )
  }

  /** Sums net revenue and counts orders from a flat order set. */
  private sumOrders(
    rows: OrderRow[]
  ): { revenue: number; orders: number } {
    let revenue = 0

    for (const row of rows) {
      const value = Number(row.total ?? 0)

      if (Number.isFinite(value)) {
        revenue += value
      }
    }

    return {
      revenue: roundMoney(revenue),
      orders: rows.length
    }
  }

  /** Counts active catalog products as of now (no temporal dimension). */
  private async countCatalogProducts(): Promise<number> {
    const sequelize = this.getSequelize()

    const rows = await sequelize.query<{
      total: number | string | null
    }>(
      `
      SELECT COUNT(*) AS "total"
      FROM ${this.table(PRODUCT_MODEL)}
      WHERE "pState" = :active;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          active: PRODUCT_STATE_ACTIVE
        }
      }
    )

    return Number(rows[0]?.total ?? 0)
  }

  /**
   * Counts active clients, optionally created within a range.
   *
   * LIMITATION:
   * There is no order<->client relation in the schema, so this is
   * an approximation of active customers, not customers with purchases.
   */
  private async countClients(
    startAt?: string,
    endAt?: string
  ): Promise<number> {
    const sequelize = this.getSequelize()
    const scoped = Boolean(startAt && endAt)

    const rows = await sequelize.query<{
      total: number | string | null
    }>(
      `
      SELECT COUNT(*) AS "total"
      FROM ${this.table(CLIENTS_TABLE)}
      WHERE "clState" = :active
      ${scoped
        ? 'AND "createdAt" >= :startAt AND "createdAt" < :endAt'
        : ''};
      `,
      {
        type: QueryTypes.SELECT,
        replacements: scoped
          ? {
              active: CLIENT_STATE_ACTIVE,
              startAt: toStoredUtcFormat(startAt!),
              endAt: toStoredUtcFormat(endAt!)
            }
          : {
              active: CLIENT_STATE_ACTIVE
            }
      }
    )

    return Number(rows[0]?.total ?? 0)
  }

  /** Buckets a flat order set into a trend series in the business timezone. */
  private bucketTrend(
    rows: OrderRow[],
    filter: DashboardFilter
  ): {
    points: TrendPoint[]
    granularity: SalesTrend['granularity']
  } {
    const range = {
      startAt: filter.startAt,
      endAt: filter.endAt
    }

    const granularity = resolveGranularity(range)
    const map = new Map<string, TrendPoint>()

    // Pre-seed every bucket with zero.
    for (const key of enumerateBuckets(
      range,
      granularity,
      filter.timezone
    )) {
      map.set(key, {
        bucket: key,
        revenue: 0,
        orders: 0
      })
    }

    // Each order contributes its NET revenue.
    for (const row of rows) {
      const key = getBucketKey(
        row.createdAt,
        granularity,
        filter.timezone
      )

      if (!key) continue

      const existing = map.get(key) ?? {
        bucket: key,
        revenue: 0,
        orders: 0
      }

      const value = Number(row.total ?? 0)

      existing.revenue = roundMoney(
        existing.revenue +
        (Number.isFinite(value) ? value : 0)
      )

      existing.orders += 1

      map.set(key, existing)
    }

    const points = Array.from(map.values()).sort(
      (a, b) => a.bucket.localeCompare(b.bucket)
    )

    return {
      points,
      granularity
    }
  }

  async getSummary(
    filter: DashboardFilter
  ): Promise<DashboardSummary> {
    const previous = getPreviousPeriodRange({
      startAt: filter.startAt,
      endAt: filter.endAt
    })

    const [
      currentOrders,
      previousOrders,
      catalogProducts,
      activeClients
    ] = await Promise.all([
      this.loadOrdersInRange(
        filter.startAt,
        filter.endAt
      ),
      this.loadOrdersInRange(
        previous.startAt,
        previous.endAt
      ),
      this.countCatalogProducts(),
      this.countClients()
    ])

    const current = this.sumOrders(currentOrders)
    const prev = this.sumOrders(previousOrders)

    const { points } = this.bucketTrend(
      currentOrders,
      filter
    )

    return {
      revenue: buildKpiMetric(
        current.revenue,
        prev.revenue
      ),

      orders: buildKpiMetric(
        current.orders,
        prev.orders
      ),

      products: buildKpiMetric(
        catalogProducts,
        null
      ),

      activeCustomers: buildKpiMetric(
        activeClients,
        null
      ),

      revenueSparkline: points.map(
        (point) => point.revenue
      ),

      ordersSparkline: points.map(
        (point) => point.orders
      ),

      range: {
        startAt: filter.startAt,
        endAt: filter.endAt,
        timezone: filter.timezone
      }
    }
  }

  async getSalesTrend(
    filter: DashboardFilter
  ): Promise<SalesTrend> {
    const orders = await this.loadOrdersInRange(
      filter.startAt,
      filter.endAt
    )

    const {
      points,
      granularity
    } = this.bucketTrend(orders, filter)

    const totals = this.sumOrders(orders)

    return {
      granularity,
      points,
      totalRevenue: totals.revenue,
      totalOrders: totals.orders
    }
  }

  /**
   * Sales by category.
   *
   * Each order's discount is distributed proportionally
   * between the categories participating in that order.
   *
   * The stored netTotal takes priority over discountAmount
   * to keep category revenue aligned with the order header.
   */
  async getSalesByCategory(
    filter: DashboardFilter
  ): Promise<SalesByCategory> {
    const sequelize = this.getSequelize()

    const rows = await sequelize.query<{
      categoryId: string | null
      categoryName: string | null
      revenue: number | string | null
      units: number | string | null
    }>(
      `
      WITH orders_in_range AS (
        SELECT
          o."stPId" AS "orderId",
          o."shoppingCartRefCode" AS "shoppingCartRefCode",
          o."pCodeRef" AS "pCodeRef",
          o."netTotal" AS "netTotal",
          COALESCE(o."discountAmount", 0) AS "discountAmount"
        FROM ${this.table(STATUS_ORDER_MODEL)} o
        INNER JOIN ${this.table(ORDER_STATUS_TYPE_MODEL)} t
          ON o."idStatus" = t."idStatus"
        WHERE t."state" = :concluded
          AND o."createdAt" >= :startAt
          AND o."createdAt" < :endAt
      ),

      -- Base product and extra revenue by category.
      category_components AS (
        SELECT
          o."orderId",
          COALESCE(
            catSold."carProId",
            catCat."carProId"
          ) AS "categoryId",
          COALESCE(
            catSold."pName",
            catCat."pName"
          ) AS "categoryName",
          (
            COALESCE(sc."priceProduct", 0) *
            COALESCE(sc."cantProducts", 1)
          ) AS "grossRevenue",
          COALESCE(sc."cantProducts", 1) AS "units"
        FROM orders_in_range o
        INNER JOIN ${this.table(SHOPPING_CART_MODEL)} sc
          ON sc."shoppingCartRefCode" = o."shoppingCartRefCode"
        LEFT JOIN ${this.table(PRODUCT_MODEL_SOLD)} ps
          ON ps."pId" = sc."pId"
        LEFT JOIN ${this.table(PRODUCT_MODEL)} p
          ON p."pId" = sc."pId"
        LEFT JOIN ${this.table(CATEGORY_PRODUCT_MODEL)} catSold
          ON catSold."carProId" = ps."carProId"
        LEFT JOIN ${this.table(CATEGORY_PRODUCT_MODEL)} catCat
          ON catCat."carProId" = p."carProId"

        UNION ALL

        SELECT
          o."orderId",
          cat."carProId" AS "categoryId",
          cat."pName" AS "categoryName",
          (
            COALESCE(es."extraPrice", 0) *
            COALESCE(es."quantity", 1)
          ) AS "grossRevenue",
          0 AS "units"
        FROM orders_in_range o
        INNER JOIN ${this.table(EXTRA_PRODUCT_MODEL_SOLD)} es
          ON es."pCodeRef" = o."pCodeRef"
        LEFT JOIN ${this.table(PRODUCT_MODEL_SOLD)} ps
          ON ps."pId" = es."pId"
        LEFT JOIN ${this.table(CATEGORY_PRODUCT_MODEL)} cat
          ON cat."carProId" = ps."carProId"
      ),

      -- Gross revenue by order and category.
      category_by_order AS (
        SELECT
          "orderId",
          "categoryId",
          "categoryName",
          SUM("grossRevenue") AS "grossRevenue",
          SUM("units") AS "units"
        FROM category_components
        GROUP BY
          "orderId",
          "categoryId",
          "categoryName"
      ),

      -- Actual gross total reconstructed from all components.
      order_component_totals AS (
        SELECT
          "orderId",
          SUM("grossRevenue") AS "grossTotal"
        FROM category_by_order
        GROUP BY "orderId"
      ),

      -- Calculate each category's participation in the NET total.
      adjusted_categories AS (
        SELECT
          c."categoryId",
          c."categoryName",
          c."units",

          c."grossRevenue" *
          CASE
            WHEN COALESCE(ot."grossTotal", 0) <= 0 THEN 1

            -- Prefer persisted netTotal.
            WHEN o."netTotal" IS NOT NULL THEN
              CASE
                WHEN o."netTotal" <= 0 THEN 0
                WHEN o."netTotal" >= ot."grossTotal" THEN 1
                ELSE
                  (1.0 * o."netTotal") / ot."grossTotal"
              END

            -- Legacy fallback using discountAmount.
            ELSE
              CASE
                WHEN COALESCE(o."discountAmount", 0) <= 0 THEN 1
                WHEN o."discountAmount" >= ot."grossTotal" THEN 0
                ELSE
                  (
                    1.0 * (
                      ot."grossTotal" - o."discountAmount"
                    )
                  ) / ot."grossTotal"
              END
          END AS "netRevenue"

        FROM category_by_order c
        INNER JOIN orders_in_range o
          ON o."orderId" = c."orderId"
        INNER JOIN order_component_totals ot
          ON ot."orderId" = c."orderId"
      )

      SELECT
        "categoryId",
        "categoryName",
        COALESCE(SUM("netRevenue"), 0) AS "revenue",
        COALESCE(SUM("units"), 0) AS "units"
      FROM adjusted_categories
      GROUP BY
        "categoryId",
        "categoryName";
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          concluded: ORDER_STATE_CONCLUDED,
          startAt: toStoredUtcFormat(filter.startAt),
          endAt: toStoredUtcFormat(filter.endAt)
        }
      }
    )

    const slicesRaw = rows.map((row) => ({
      categoryId: row.categoryId ?? null,
      categoryName: row.categoryName ?? UNCATEGORIZED,
      revenue: roundMoney(Number(row.revenue ?? 0)),
      units: Number(row.units ?? 0)
    }))

    const totalRevenue = roundMoney(
      slicesRaw.reduce(
        (acc, item) => acc + item.revenue,
        0
      )
    )

    const slices: CategorySalesSlice[] = slicesRaw
      .map((item) => ({
        ...item,
        percentage:
          totalRevenue > 0
            ? Math.round(
                (item.revenue / totalRevenue) * 10000
              ) / 100
            : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)

    return {
      slices,
      totalRevenue
    }
  }

  /**
   * Top products.
   *
   * Product and extra revenue are grouped by parent product.
   * Each product receives its proportional share of the order discount.
   *
   * IMPORTANT:
   * The category filter is applied AFTER calculating the proportional
   * discount, so filtering a category does not redistribute the discount
   * incorrectly among only the visible products.
   */
  async getTopProducts(
    filter: DashboardFilter
  ): Promise<TopProductSale[]> {
    const sequelize = this.getSequelize()

    const categoryClause = filter.categoryIds?.length
      ? 'AND "catId" IN (:categoryIds)'
      : ''

    const orderByColumn =
      filter.sortBy === 'revenue'
        ? 'revenue'
        : 'unitsSold'

    const rows = await sequelize.query<{
      idProduct: string | null
      productName: string | null
      image: string | null
      unitsSold: number | string | null
      revenue: number | string | null
    }>(
      `
      WITH orders_in_range AS (
        SELECT
          o."stPId" AS "orderId",
          o."shoppingCartRefCode" AS "shoppingCartRefCode",
          o."pCodeRef" AS "pCodeRef",
          o."netTotal" AS "netTotal",
          COALESCE(o."discountAmount", 0) AS "discountAmount"
        FROM ${this.table(STATUS_ORDER_MODEL)} o
        INNER JOIN ${this.table(ORDER_STATUS_TYPE_MODEL)} t
          ON o."idStatus" = t."idStatus"
        WHERE t."state" = :concluded
          AND o."createdAt" >= :startAt
          AND o."createdAt" < :endAt
      ),

      -- Base product revenue and extra revenue.
      product_components AS (
        SELECT
          o."orderId",
          sc."pId" AS "idProduct",
          COALESCE(
            ps."pName",
            p."pName",
            'Producto'
          ) AS "productName",
          COALESCE(
            ps."ProImage",
            p."ProImage"
          ) AS "image",
          COALESCE(sc."cantProducts", 1) AS "units",
          (
            COALESCE(sc."priceProduct", 0) *
            COALESCE(sc."cantProducts", 1)
          ) AS "grossRevenue",
          COALESCE(
            ps."carProId",
            p."carProId"
          ) AS "catId"
        FROM orders_in_range o
        INNER JOIN ${this.table(SHOPPING_CART_MODEL)} sc
          ON sc."shoppingCartRefCode" = o."shoppingCartRefCode"
        LEFT JOIN ${this.table(PRODUCT_MODEL_SOLD)} ps
          ON ps."pId" = sc."pId"
        LEFT JOIN ${this.table(PRODUCT_MODEL)} p
          ON p."pId" = sc."pId"

        UNION ALL

        SELECT
          o."orderId",
          es."pId" AS "idProduct",
          COALESCE(
            ps."pName",
            'Producto'
          ) AS "productName",
          ps."ProImage" AS "image",
          0 AS "units",
          (
            COALESCE(es."extraPrice", 0) *
            COALESCE(es."quantity", 1)
          ) AS "grossRevenue",
          ps."carProId" AS "catId"
        FROM orders_in_range o
        INNER JOIN ${this.table(EXTRA_PRODUCT_MODEL_SOLD)} es
          ON es."pCodeRef" = o."pCodeRef"
        LEFT JOIN ${this.table(PRODUCT_MODEL_SOLD)} ps
          ON ps."pId" = es."pId"
      ),

      -- Group all components belonging to the same parent product
      -- inside each order.
      product_by_order AS (
        SELECT
          "orderId",
          MIN("idProduct") AS "idProduct",
          "productName",
          MAX("image") AS "image",
          "catId",
          SUM("units") AS "units",
          SUM("grossRevenue") AS "grossRevenue"
        FROM product_components
        GROUP BY
          "orderId",
          "productName",
          "catId"
      ),

      -- Gross order total from ALL products, extras included.
      order_component_totals AS (
        SELECT
          "orderId",
          SUM("grossRevenue") AS "grossTotal"
        FROM product_by_order
        GROUP BY "orderId"
      ),

      -- Apply the discount proportionally before ranking products.
      ranked_products AS (
        SELECT
          MIN(pb."idProduct") AS "idProduct",
          pb."productName",
          MAX(pb."image") AS "image",
          pb."catId",

          COALESCE(
            SUM(pb."units"),
            0
          ) AS "unitsSold",

          COALESCE(
            SUM(
              pb."grossRevenue" *
              CASE
                WHEN COALESCE(ot."grossTotal", 0) <= 0 THEN 1

                -- New orders: netTotal is authoritative.
                WHEN o."netTotal" IS NOT NULL THEN
                  CASE
                    WHEN o."netTotal" <= 0 THEN 0
                    WHEN o."netTotal" >= ot."grossTotal" THEN 1
                    ELSE
                      (1.0 * o."netTotal") / ot."grossTotal"
                  END

                -- Legacy orders: use discountAmount.
                ELSE
                  CASE
                    WHEN COALESCE(o."discountAmount", 0) <= 0 THEN 1
                    WHEN o."discountAmount" >= ot."grossTotal" THEN 0
                    ELSE
                      (
                        1.0 * (
                          ot."grossTotal" - o."discountAmount"
                        )
                      ) / ot."grossTotal"
                  END
              END
            ),
            0
          ) AS "revenue"

        FROM product_by_order pb
        INNER JOIN orders_in_range o
          ON o."orderId" = pb."orderId"
        INNER JOIN order_component_totals ot
          ON ot."orderId" = pb."orderId"

        GROUP BY
          pb."productName",
          pb."catId"

        HAVING
          SUM(pb."grossRevenue") > 0
          OR SUM(pb."units") > 0
      )

      SELECT
        "idProduct",
        "productName",
        "image",
        "unitsSold",
        "revenue"
      FROM ranked_products
      WHERE 1 = 1
        ${categoryClause}
      ORDER BY "${orderByColumn}" DESC
      LIMIT :limit;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          concluded: ORDER_STATE_CONCLUDED,
          startAt: toStoredUtcFormat(filter.startAt),
          endAt: toStoredUtcFormat(filter.endAt),
          categoryIds: filter.categoryIds ?? [],
          limit: Math.min(
            filter.pageSize ?? TOP_PRODUCTS_LIMIT,
            TOP_PRODUCTS_LIMIT
          )
        }
      }
    )

    return rows.map((row) => ({
      idProduct: row.idProduct ?? null,
      productName: row.productName ?? 'Producto sin nombre',
      image: row.image ?? null,
      unitsSold: Number(row.unitsSold ?? 0),
      revenue: roundMoney(Number(row.revenue ?? 0))
    }))
  }

  /**
   * Recent orders.
   *
   * total = gross sale value.
   * discountAmount = actual money discounted.
   * netTotal = final sale value.
   *
   * Legacy orders without netTotal reconstruct the net value
   * from grossTotal - discountAmount.
   */
  async getRecentOrders(
    filter: DashboardFilter
  ): Promise<RecentOrdersPage> {
    const sequelize = this.getSequelize()

    const page = filter.page ?? 1
    const pageSize = filter.pageSize ?? 10
    const offset = (page - 1) * pageSize

    const sortColumn =
      RECENT_ORDERS_SORT_ALLOWLIST[
        filter.sortBy ?? 'createdAt'
      ] ?? 'createdAt'

    const direction =
      filter.sortDirection === 'ASC'
        ? 'ASC'
        : 'DESC'

    const search = filter.search
      ? `%${filter.search.toLowerCase()}%`
      : null

    const searchClause = search
      ? 'AND LOWER(o."pCodeRef") LIKE :search'
      : ''

    // Count only completed orders, using the same filters as the data query.
    const countRows = await sequelize.query<{
      total: number | string | null
    }>(
      `
      SELECT COUNT(*) AS "total"
      FROM ${this.table(STATUS_ORDER_MODEL)} o
      INNER JOIN ${this.table(ORDER_STATUS_TYPE_MODEL)} t
        ON o."idStatus" = t."idStatus"
      WHERE t."state" = :concluded
        AND o."createdAt" >= :startAt
        AND o."createdAt" < :endAt
        ${searchClause};
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          concluded: ORDER_STATE_CONCLUDED,
          startAt: toStoredUtcFormat(filter.startAt),
          endAt: toStoredUtcFormat(filter.endAt),
          ...(search ? { search } : {})
        }
      }
    )

    const total = Number(countRows[0]?.total ?? 0)

    const rows = await sequelize.query<{
      orderId: string
      code: string
      createdAt: string | Date
      statusState: number | string | null
      total: number | string | null
      discountType: string | null
      discountAmount: number | string | null
      netTotal: number | string | null
      productName: string | null
      itemCount: number | string | null
    }>(
      `
      WITH recent_orders AS (
        SELECT
          o.*,
          t."state" AS "statusState",

          -- Gross sale value, including products and extras.
          COALESCE(
            NULLIF(o."totalProductsPrice", 0),

            COALESCE((
              SELECT SUM(
                COALESCE(scT."priceProduct", 0) *
                COALESCE(scT."cantProducts", 1)
              )
              FROM ${this.table(SHOPPING_CART_MODEL)} scT
              WHERE scT."shoppingCartRefCode" = o."shoppingCartRefCode"
            ), 0)

            +

            COALESCE((
              SELECT SUM(
                COALESCE(esT."extraPrice", 0) *
                COALESCE(esT."quantity", 1)
              )
              FROM ${this.table(EXTRA_PRODUCT_MODEL_SOLD)} esT
              WHERE esT."pCodeRef" = o."pCodeRef"
            ), 0),

            0
          ) AS "grossTotal"

        FROM ${this.table(STATUS_ORDER_MODEL)} o
        INNER JOIN ${this.table(ORDER_STATUS_TYPE_MODEL)} t
          ON o."idStatus" = t."idStatus"
        WHERE t."state" = :concluded
          AND o."createdAt" >= :startAt
          AND o."createdAt" < :endAt
          ${searchClause}
      )

      SELECT
        o."stPId" AS "orderId",
        o."pCodeRef" AS "code",
        o."createdAt" AS "createdAt",
        o."statusState" AS "statusState",

        -- Gross value before the discount.
        o."grossTotal" AS "total",

        o."discountType" AS "discountType",

        COALESCE(
          o."discountAmount",
          0
        ) AS "discountAmount",

        -- Prefer persisted netTotal.
        -- Legacy fallback: grossTotal minus discountAmount.
        CASE
          WHEN o."netTotal" IS NOT NULL THEN
            CASE
              WHEN o."netTotal" < 0 THEN 0
              ELSE o."netTotal"
            END

          ELSE
            CASE
              WHEN (
                o."grossTotal" - MAX(
                  COALESCE(o."discountAmount", 0),
                  0
                )
              ) > 0
                THEN o."grossTotal" - MAX(
                  COALESCE(o."discountAmount", 0),
                  0
                )
              ELSE 0
            END
        END AS "netTotal",

        (
          SELECT COALESCE(
            ps2."pName",
            p2."pName"
          )
          FROM ${this.table(SHOPPING_CART_MODEL)} sc2
          LEFT JOIN ${this.table(PRODUCT_MODEL_SOLD)} ps2
            ON ps2."pId" = sc2."pId"
          LEFT JOIN ${this.table(PRODUCT_MODEL)} p2
            ON p2."pId" = sc2."pId"
          WHERE sc2."shoppingCartRefCode" = o."shoppingCartRefCode"
          LIMIT 1
        ) AS "productName",

        (
          SELECT COUNT(*)
          FROM ${this.table(SHOPPING_CART_MODEL)} sc3
          WHERE sc3."shoppingCartRefCode" = o."shoppingCartRefCode"
        ) AS "itemCount"

      FROM recent_orders o
      ORDER BY
        o."${sortColumn}" ${direction},
        o."stPId" ${direction}
      LIMIT :limit OFFSET :offset;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          concluded: ORDER_STATE_CONCLUDED,
          startAt: toStoredUtcFormat(filter.startAt),
          endAt: toStoredUtcFormat(filter.endAt),
          limit: pageSize,
          offset,
          ...(search ? { search } : {})
        }
      }
    )

    const mapped: RecentOrderRow[] = rows.map((row) => {
      const itemCount = Number(row.itemCount ?? 0)

      const extraItems = itemCount > 1
        ? itemCount - 1
        : 0

      const discountAmount = roundMoney(
        Number(row.discountAmount ?? 0)
      )

      return {
        orderId: row.orderId,
        code: row.code,
        productSummary: row.productName ?? 'Pedido',
        extraItems,
        createdAt: normalizeToIso(row.createdAt),
        statusState: Number(row.statusState ?? 0),

        // Gross sale value before discount.
        total: roundMoney(Number(row.total ?? 0)),

        discountType: row.discountType ?? null,
        discountAmount,

        // Final revenue after discount.
        netTotal: roundMoney(
          Number(row.netTotal ?? row.total ?? 0)
        )
      }
    })

    return {
      rows: mapped,
      total,
      page,
      pageSize
    }
  }
}
