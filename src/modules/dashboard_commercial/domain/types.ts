/**
 * Domain types for the commercial + inventory dashboard aggregations.
 *
 * All monetary values are returned as numbers matching the stored
 * `orders_statuses.totalProductsPrice` (DECIMAL). The system is single-currency;
 * there is no per-order currency column in the data model.
 */

/**
 * Normalized, validated filter set shared by every dashboard aggregation.
 * Dates are already resolved to a half-open UTC interval `[startAt, endAt)`.
 */
export interface DashboardFilter {
  /** Inclusive lower bound (ISO UTC). */
  startAt: string
  /** Exclusive upper bound (ISO UTC). */
  endAt: string
  /** IANA business timezone used for bucketing/labels. */
  timezone: string
  /** Optional category ids (`product_models.carProId`) to scope by. */
  categoryIds?: string[]
  /** Optional product ids (`product_models.pId`) to scope by. */
  productIds?: string[]
  /** Free-text search (order code / product name) for listings. */
  search?: string
  /** 1-based page number for paginated listings. */
  page?: number
  /** Page size for paginated listings. */
  pageSize?: number
  /** Allowlisted sort field for listings. */
  sortBy?: string
  /** Sort direction. */
  sortDirection?: 'ASC' | 'DESC'
}

/**
 * A single value plus its comparison against the previous equivalent period.
 */
export interface KpiMetric {
  /** Current-period value. */
  value: number
  /** Previous-period value, or null when no comparable history exists. */
  previousValue: number | null
  /**
   * Percentage change vs. previous period, or null when it cannot be computed
   * (e.g. previous is zero, or no historical data). Never Infinity/NaN.
   */
  percentageChange: number | null
  /** Qualitative direction derived from the comparison. */
  trend: 'up' | 'down' | 'flat' | 'unknown'
}

/**
 * One point of a time-series sparkline/trend.
 */
export interface TrendPoint {
  /** Local bucket key (ISO-ish) in the business timezone. */
  bucket: string
  /** Revenue within the bucket. */
  revenue: number
  /** Order count within the bucket. */
  orders: number
}

/**
 * KPI summary returned for the four top cards.
 */
export interface DashboardSummary {
  revenue: KpiMetric
  orders: KpiMetric
  /** Total catalog products (active). Not a stock/units figure. */
  products: KpiMetric
  /**
   * Active customers. LIMITATION: the schema has no order<->client relation,
   * so this counts active clients (`clients.clState = 1`), not "clients with
   * purchases in the period".
   */
  activeCustomers: KpiMetric
  /** Short revenue sparkline for the revenue card. */
  revenueSparkline: number[]
  /** Short orders sparkline for the orders card. */
  ordersSparkline: number[]
  /** The period the summary was computed for. */
  range: { startAt: string; endAt: string; timezone: string }
}

/**
 * Trend series with granularity metadata.
 */
export interface SalesTrend {
  granularity: 'hour' | 'day' | 'week'
  points: TrendPoint[]
  /** Total revenue across the series (consistent with KPI revenue). */
  totalRevenue: number
  /** Total orders across the series. */
  totalOrders: number
}

/**
 * One category slice of the sales-by-category donut.
 */
export interface CategorySalesSlice {
  categoryId: string | null
  categoryName: string
  revenue: number
  units: number
  /** Share of total revenue in [0, 100], rounded to 2 decimals. */
  percentage: number
}

/**
 * Sales grouped by product category.
 */
export interface SalesByCategory {
  slices: CategorySalesSlice[]
  totalRevenue: number
}

/**
 * One row of the top-products ranking, based on real completed sales.
 */
export interface TopProductSale {
  idProduct: string | null
  productName: string
  image: string | null
  unitsSold: number
  revenue: number
}

/**
 * One recent-order row for the listing table.
 */
export interface RecentOrderRow {
  orderId: string
  /** Human-visible order code (`pCodeRef`). */
  code: string
  /** Primary product name + "+N" summary when the order has several lines. */
  productSummary: string
  /** Count of additional line items beyond the primary product. */
  extraItems: number
  /** ISO UTC creation instant; the client formats it in the business tz. */
  createdAt: string
  /** Raw persisted status state (order_status_types.state). */
  statusState: number
  /** GROSS sale value (before the global discount). */
  total: number
  /** Discount type applied at sale time ('PERCENT' | 'AMOUNT'); null when none. */
  discountType?: string | null
  /** Money actually discounted on the order. */
  discountAmount?: number
  /** Net income of the order (gross - discount). */
  netTotal?: number
}

/**
 * Paginated recent-orders result.
 */
export interface RecentOrdersPage {
  rows: RecentOrderRow[]
  total: number
  page: number
  pageSize: number
}

/**
 * Port for the commercial dashboard aggregations. Implementations must scope
 * every query to the authenticated tenant and never leak cross-tenant rows.
 */
export interface IDashboardCommercialRepository {
  getSummary(filter: DashboardFilter): Promise<DashboardSummary>
  getSalesTrend(filter: DashboardFilter): Promise<SalesTrend>
  getSalesByCategory(filter: DashboardFilter): Promise<SalesByCategory>
  getTopProducts(filter: DashboardFilter): Promise<TopProductSale[]>
  getRecentOrders(filter: DashboardFilter): Promise<RecentOrdersPage>
}
