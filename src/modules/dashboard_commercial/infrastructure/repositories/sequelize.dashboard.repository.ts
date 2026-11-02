import { QueryTypes } from 'sequelize'

import { CATEGORY_PRODUCT_MODEL } from '../../../category_products/infrastructure/db/sequelize/models/sequelize-model'
import { CLIENTS_TABLE } from '../../../clients/infrastructure/db/sequelize/models/sequelize-table.model'
import { PRODUCT_MODEL } from '../../../products/infrastructure/db/sequelize/models/sequelize-product.model'
import { PRODUCT_MODEL_SOLD } from '../../../products/infrastructure/db/sequelize/models/sequelize-product-sold.model'
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

type OrderRow = { createdAt: string | Date; total: number | string | null }

/**
 * Normalizes a DB `createdAt` value into an ISO-8601 UTC string the browser can
 * parse. The app stores timestamps as text like `2026-10-03 21:10:15.988
 * +00:00`; `new Date()` does not parse that shape reliably, so we convert the
 * space separator and ` +00:00` suffix to `T` and `Z`.
 *
 * @param value - Raw `createdAt` from the DB (Date or stored text).
 * @returns An ISO UTC string.
 */
const normalizeToIso = (value: string | Date): string => {
  if (value instanceof Date) return value.toISOString()
  const raw = String(value).trim()
  const normalized = raw.replace(' ', 'T').replace(' +00:00', 'Z').replace('+00:00', 'Z')
  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? raw : parsed.toISOString()
}

/**
 * Sequelize-backed implementation of the commercial dashboard aggregations.
 *
 * Every query is scoped to the tenant schema (same convention as the stock
 * module) and uses parameterized half-open date bounds `[startAt, endAt)` so it
 * is portable across SQLite (dev/test) and PostgreSQL (prod) without relying on
 * dialect-specific date functions.
 */
export class SequelizeDashboardCommercialRepository implements IDashboardCommercialRepository {
  private readonly tenant: string

  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  /** @returns The shared Sequelize instance, or throws when unavailable. */
  private getSequelize() {
    const sequelize = models.Product.sequelize
    if (!sequelize) throw new Error('Sequelize instance is not available')
    return sequelize
  }

  /** @returns Fully-qualified, quoted tenant table identifier. */
  private table(name: string): string {
    return `"${this.tenant}.${name}"`
  }

  /**
   * Loads completed orders (one row per order) within a half-open range.
   *
   * Per-order revenue prefers the header total `orders_statuses.totalProductsPrice`,
   * but falls back to the sum of the order's line items (`shopping_carts`) when
   * the header is 0 or null. Some order-creation flows leave the header at 0
   * while still writing priced line items, which previously made Revenue/Trend
   * show $0 even though Sales-by-Category (which reads the line items) showed
   * the real amount. The COALESCE keeps all commercial widgets consistent.
   *
   * Aggregating one row per order avoids join multiplication of money.
   */
  private async loadOrdersInRange(startAt: string, endAt: string): Promise<OrderRow[]> {
    const sequelize = this.getSequelize()
    return sequelize.query<OrderRow>(
      `
      SELECT
        o."createdAt" AS "createdAt",
        COALESCE(
          NULLIF(o."totalProductsPrice", 0),
          (
            SELECT SUM(sc."priceProduct" * COALESCE(sc."cantProducts", 1))
            FROM ${this.table(SHOPPING_CART_MODEL)} sc
            WHERE sc."shoppingCartRefCode" = o."shoppingCartRefCode"
          ),
          0
        ) AS "total"
      FROM ${this.table(STATUS_ORDER_MODEL)} o
      INNER JOIN ${this.table(ORDER_STATUS_TYPE_MODEL)} t
        ON o."idStatus" = t."idStatus"
      WHERE t."state" = :concluded
        AND o."createdAt" >= :startAt
        AND o."createdAt" < :endAt;
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

  /** Sums revenue and counts orders from a flat order set. */
  private sumOrders(rows: OrderRow[]): { revenue: number; orders: number } {
    let revenue = 0
    for (const row of rows) {
      const value = Number(row.total ?? 0)
      if (Number.isFinite(value)) revenue += value
    }
    return { revenue: roundMoney(revenue), orders: rows.length }
  }

  /** Counts active catalog products as of now (no temporal dimension). */
  private async countCatalogProducts(): Promise<number> {
    const sequelize = this.getSequelize()
    const rows = await sequelize.query<{ total: number | string | null }>(
      `
      SELECT COUNT(*) AS "total"
      FROM ${this.table(PRODUCT_MODEL)}
      WHERE "pState" = :active;
      `,
      { type: QueryTypes.SELECT, replacements: { active: PRODUCT_STATE_ACTIVE } }
    )
    return Number(rows[0]?.total ?? 0)
  }

  /**
   * Counts active clients, optionally created within a range.
   * LIMITATION: there is no order<->client relation in the schema, so this is
   * an approximation of "active customers", not "customers with purchases".
   */
  private async countClients(startAt?: string, endAt?: string): Promise<number> {
    const sequelize = this.getSequelize()
    const scoped = startAt && endAt
    const rows = await sequelize.query<{ total: number | string | null }>(
      `
      SELECT COUNT(*) AS "total"
      FROM ${this.table(CLIENTS_TABLE)}
      WHERE "clState" = :active
      ${scoped ? 'AND "createdAt" >= :startAt AND "createdAt" < :endAt' : ''};
      `,
      {
        type: QueryTypes.SELECT,
        replacements: scoped
          ? { active: CLIENT_STATE_ACTIVE, startAt: toStoredUtcFormat(startAt), endAt: toStoredUtcFormat(endAt) }
          : { active: CLIENT_STATE_ACTIVE }
      }
    )
    return Number(rows[0]?.total ?? 0)
  }

  /** Buckets a flat order set into a trend series in the business timezone. */
  private bucketTrend(
    rows: OrderRow[],
    filter: DashboardFilter
  ): { points: TrendPoint[]; granularity: SalesTrend['granularity'] } {
    const range = { startAt: filter.startAt, endAt: filter.endAt }
    const granularity = resolveGranularity(range)

    // Pre-seed every bucket in the range with zero so the series is continuous
    // across the whole period (e.g. all 15 days) and the chart/sparkline draw a
    // line even when sales land on a single day. Zero here means "no sales",
    // which is the correct meaning for an empty bucket.
    const map = new Map<string, TrendPoint>()
    for (const key of enumerateBuckets(range, granularity, filter.timezone)) {
      map.set(key, { bucket: key, revenue: 0, orders: 0 })
    }

    for (const row of rows) {
      const key = getBucketKey(row.createdAt, granularity, filter.timezone)
      if (!key) continue
      const existing = map.get(key) ?? { bucket: key, revenue: 0, orders: 0 }
      const value = Number(row.total ?? 0)
      existing.revenue = roundMoney(existing.revenue + (Number.isFinite(value) ? value : 0))
      existing.orders += 1
      map.set(key, existing)
    }

    const points = Array.from(map.values()).sort((a, b) => a.bucket.localeCompare(b.bucket))
    return { points, granularity }
  }

  async getSummary(filter: DashboardFilter): Promise<DashboardSummary> {
    const previous = getPreviousPeriodRange({ startAt: filter.startAt, endAt: filter.endAt })

    const [currentOrders, previousOrders, catalogProducts, activeClients] = await Promise.all([
      this.loadOrdersInRange(filter.startAt, filter.endAt),
      this.loadOrdersInRange(previous.startAt, previous.endAt),
      this.countCatalogProducts(),
      this.countClients()
    ])

    const current = this.sumOrders(currentOrders)
    const prev = this.sumOrders(previousOrders)
    const { points } = this.bucketTrend(currentOrders, filter)

    return {
      revenue: buildKpiMetric(current.revenue, prev.revenue),
      orders: buildKpiMetric(current.orders, prev.orders),
      // Catalog size is a point-in-time count; there is no comparable history.
      products: buildKpiMetric(catalogProducts, null),
      // Active clients: no order relation -> no period comparison available.
      activeCustomers: buildKpiMetric(activeClients, null),
      revenueSparkline: points.map((p) => p.revenue),
      ordersSparkline: points.map((p) => p.orders),
      range: { startAt: filter.startAt, endAt: filter.endAt, timezone: filter.timezone }
    }
  }

  async getSalesTrend(filter: DashboardFilter): Promise<SalesTrend> {
    const orders = await this.loadOrdersInRange(filter.startAt, filter.endAt)
    const { points, granularity } = this.bucketTrend(orders, filter)
    const totals = this.sumOrders(orders)

    return {
      granularity,
      points,
      totalRevenue: totals.revenue,
      totalOrders: totals.orders
    }
  }

  async getSalesByCategory(filter: DashboardFilter): Promise<SalesByCategory> {
    const sequelize = this.getSequelize()

    // Revenue/units per category from completed-order line items. Line items
    // (shopping_carts) join orders by the shared string key shoppingCartRefCode;
    // category comes from product_models.carProId -> category_products.
    const rows = await sequelize.query<{
      categoryId: string | null
      categoryName: string | null
      revenue: number | string | null
      units: number | string | null
    }>(
      // Sold line items reference `product_models_sold` (a snapshot taken at the
      // moment of sale); only legacy/catalog rows match `product_models`. We join
      // both and COALESCE so the category resolves from whichever source has it.
      `
      SELECT
        COALESCE(catSold."carProId", catCat."carProId") AS "categoryId",
        COALESCE(catSold."pName", catCat."pName") AS "categoryName",
        COALESCE(SUM(sc."priceProduct" * COALESCE(sc."cantProducts", 1)), 0) AS "revenue",
        COALESCE(SUM(COALESCE(sc."cantProducts", 1)), 0) AS "units"
      FROM ${this.table(STATUS_ORDER_MODEL)} o
      INNER JOIN ${this.table(ORDER_STATUS_TYPE_MODEL)} t
        ON o."idStatus" = t."idStatus"
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
      WHERE t."state" = :concluded
        AND o."createdAt" >= :startAt
        AND o."createdAt" < :endAt
      GROUP BY
        COALESCE(catSold."carProId", catCat."carProId"),
        COALESCE(catSold."pName", catCat."pName");
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

    const totalRevenue = roundMoney(slicesRaw.reduce((acc, s) => acc + s.revenue, 0))

    const slices: CategorySalesSlice[] = slicesRaw
      .map((s) => ({
        ...s,
        percentage: totalRevenue > 0 ? Math.round((s.revenue / totalRevenue) * 10000) / 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)

    return { slices, totalRevenue }
  }

  async getTopProducts(filter: DashboardFilter): Promise<TopProductSale[]> {
    const sequelize = this.getSequelize()

    // Category filter applies to whichever product source resolves the id.
    const categoryClause = filter.categoryIds?.length
      ? 'AND COALESCE(ps."carProId", p."carProId") IN (:categoryIds)'
      : ''

    const rows = await sequelize.query<{
      idProduct: string | null
      productName: string | null
      image: string | null
      unitsSold: number | string | null
      revenue: number | string | null
    }>(
      // Sold line items reference `product_models_sold`, a per-sale snapshot
      // where the same logical product gets a new pId (and a new order-scoped
      // pCodeRef) on every sale. The stable identity of a product across sales
      // is its name, so we consolidate the ranking by product name plus its
      // category id (as a tie-breaker so two distinct products that happen to
      // share a name are not merged). Name/image/id come from whichever product
      // source (sold snapshot or live catalog) has them.
      `
      SELECT
        MIN(sc."pId") AS "idProduct",
        COALESCE(ps."pName", p."pName", 'Producto') AS "productName",
        MAX(COALESCE(ps."ProImage", p."ProImage")) AS "image",
        COALESCE(SUM(COALESCE(sc."cantProducts", 1)), 0) AS "unitsSold",
        COALESCE(SUM(sc."priceProduct" * COALESCE(sc."cantProducts", 1)), 0) AS "revenue"
      FROM ${this.table(STATUS_ORDER_MODEL)} o
      INNER JOIN ${this.table(ORDER_STATUS_TYPE_MODEL)} t
        ON o."idStatus" = t."idStatus"
      INNER JOIN ${this.table(SHOPPING_CART_MODEL)} sc
        ON sc."shoppingCartRefCode" = o."shoppingCartRefCode"
      LEFT JOIN ${this.table(PRODUCT_MODEL_SOLD)} ps
        ON ps."pId" = sc."pId"
      LEFT JOIN ${this.table(PRODUCT_MODEL)} p
        ON p."pId" = sc."pId"
      WHERE t."state" = :concluded
        AND o."createdAt" >= :startAt
        AND o."createdAt" < :endAt
        ${categoryClause}
      GROUP BY
        COALESCE(ps."pName", p."pName"),
        COALESCE(ps."carProId", p."carProId")
      HAVING SUM(COALESCE(sc."cantProducts", 1)) > 0
      ORDER BY "${filter.sortBy === 'revenue' ? 'revenue' : 'unitsSold'}" DESC
      LIMIT :limit;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          concluded: ORDER_STATE_CONCLUDED,
          startAt: toStoredUtcFormat(filter.startAt),
          endAt: toStoredUtcFormat(filter.endAt),
          categoryIds: filter.categoryIds ?? [],
          limit: Math.min(filter.pageSize ?? TOP_PRODUCTS_LIMIT, TOP_PRODUCTS_LIMIT)
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

  async getRecentOrders(filter: DashboardFilter): Promise<RecentOrdersPage> {
    const sequelize = this.getSequelize()
    const page = filter.page ?? 1
    const pageSize = filter.pageSize ?? 10
    const offset = (page - 1) * pageSize
    const sortColumn = RECENT_ORDERS_SORT_ALLOWLIST[filter.sortBy ?? 'createdAt'] ?? 'createdAt'
    const direction = filter.sortDirection === 'ASC' ? 'ASC' : 'DESC'
    const search = filter.search ? `%${filter.search.toLowerCase()}%` : null

    const searchClause = search ? 'AND LOWER(o."pCodeRef") LIKE :search' : ''

    const countRows = await sequelize.query<{ total: number | string | null }>(
      `
      SELECT COUNT(*) AS "total"
      FROM ${this.table(STATUS_ORDER_MODEL)} o
      INNER JOIN ${this.table(ORDER_STATUS_TYPE_MODEL)} t
        ON o."idStatus" = t."idStatus"
      WHERE o."createdAt" >= :startAt
        AND o."createdAt" < :endAt
        ${searchClause};
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
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
      productName: string | null
      itemCount: number | string | null
    }>(
      `
      SELECT
        o."stPId" AS "orderId",
        o."pCodeRef" AS "code",
        o."createdAt" AS "createdAt",
        t."state" AS "statusState",
        COALESCE(
          NULLIF(o."totalProductsPrice", 0),
          (
            SELECT SUM(scT."priceProduct" * COALESCE(scT."cantProducts", 1))
            FROM ${this.table(SHOPPING_CART_MODEL)} scT
            WHERE scT."shoppingCartRefCode" = o."shoppingCartRefCode"
          ),
          0
        ) AS "total",
        (
          SELECT COALESCE(ps2."pName", p2."pName")
          FROM ${this.table(SHOPPING_CART_MODEL)} sc2
          LEFT JOIN ${this.table(PRODUCT_MODEL_SOLD)} ps2 ON ps2."pId" = sc2."pId"
          LEFT JOIN ${this.table(PRODUCT_MODEL)} p2 ON p2."pId" = sc2."pId"
          WHERE sc2."shoppingCartRefCode" = o."shoppingCartRefCode"
          LIMIT 1
        ) AS "productName",
        (
          SELECT COUNT(*)
          FROM ${this.table(SHOPPING_CART_MODEL)} sc3
          WHERE sc3."shoppingCartRefCode" = o."shoppingCartRefCode"
        ) AS "itemCount"
      FROM ${this.table(STATUS_ORDER_MODEL)} o
      INNER JOIN ${this.table(ORDER_STATUS_TYPE_MODEL)} t
        ON o."idStatus" = t."idStatus"
      WHERE o."createdAt" >= :startAt
        AND o."createdAt" < :endAt
        ${searchClause}
      ORDER BY o."${sortColumn}" ${direction}, o."stPId" ${direction}
      LIMIT :limit OFFSET :offset;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
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
      const extraItems = itemCount > 1 ? itemCount - 1 : 0
      return {
        orderId: row.orderId,
        code: row.code,
        productSummary: row.productName ?? 'Pedido',
        extraItems,
        createdAt: normalizeToIso(row.createdAt),
        statusState: Number(row.statusState ?? 0),
        total: roundMoney(Number(row.total ?? 0))
      }
    })

    return { rows: mapped, total, page, pageSize }
  }
}
