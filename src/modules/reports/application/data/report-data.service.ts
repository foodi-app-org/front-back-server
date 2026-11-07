import { models } from '@shared/infrastructure/db'
import { MigrationFolder } from '@shared/infrastructure/db/sequelize/migrations/umzug.config'
import {
  getPeriodRange,
  toStoredUtcFormat
} from '@shared/utils/period-range.utils'
import { QueryTypes } from 'sequelize'

import { PRODUCT_MODEL } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product.model'
import { PRODUCT_MODEL_SOLD } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product-sold.model'
import { EXTRA_PRODUCT_MODEL } from '@modules/product_extra/infrastructure/db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra.model'
import { EXTRA_PRODUCT_MODEL_SOLD } from '@modules/product_extra/infrastructure/db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra-sold.model'
import { SHOPPING_CART_MODEL } from '@modules/shopping/infrastructure/db/sequelize/models/sequelize-shopping-cart.model'
import { STATUS_ORDER_MODEL } from '@modules/status_order/infrastructure/db/sequelize/models/sequelize-status_orders.model'
import { ORDER_STATUS_TYPE_MODEL } from '@modules/status_order_types/infrastructure/db/sequelize/models/sequelize-status_orders_types.model'
import { PAYMENT_METHOD_MODEL } from '@modules/payment_method/infrastructure/db/sequelize/models/sequelize-payment_method.model'
import { CLIENTS_TABLE } from '@modules/clients/infrastructure/db/sequelize/models/sequelize-table.model'

import { findReportDefinition } from '../../domain/catalog/report-catalog'
import {
  ReportFilterValues,
  ReportTable
} from '../../domain/types'
import { combineSalesByProductRows, reportSql, ReportSqlModels } from './report-data.helpers'

/** Model/table names passed to the shared SQL builders. */
const SQL_MODELS: ReportSqlModels = {
  PRODUCT_MODEL,
  PRODUCT_MODEL_SOLD,
  EXTRA_PRODUCT_MODEL,
  EXTRA_PRODUCT_MODEL_SOLD,
  SHOPPING_CART_MODEL,
  STATUS_ORDER_MODEL,
  ORDER_STATUS_TYPE_MODEL
}

/**
 * The data portion of a report produced by a query method: always carries
 * `rows`, optionally a `summary` and a `note`. The `build` method combines this
 * with the catalog-derived `reportId`, `name` and `columns`.
 */
type ReportTableData = Pick<ReportTable, 'rows'> & Partial<Pick<ReportTable, 'summary' | 'note'>>

/** Order state that marks a concluded/confirmed sale. */
const ORDER_STATE_CONCLUDED = 4
/** Default low-stock threshold for the low-stock report. */
const LOW_STOCK_THRESHOLD = 5
/**
 * Active state shared by products (`pState`) and extras (`exState`).
 * StateProduct.ACTIVE === StateProductExtra.ACTIVE === 1. Used by CURRENT
 * inventory reports to exclude inactive/archived items (0 / -1). It is NOT
 * applied to historical sales reports (see salesByProduct).
 */
const STATE_ACTIVE = 1

/**
 * A resolved half-open UTC range expressed in the DB stored-text format so
 * lexicographic comparisons against text `createdAt` columns are correct on
 * both SQLite (dev) and PostgreSQL (prod).
 */
interface StoredRange {
  startAt: string
  endAt: string
}

/**
 * Report data service. Produces a uniform {@link ReportTable} per report id and
 * is fully decoupled from file generation (XLSX/CSV). Every query is scoped to
 * the tenant schema and respects the authoritative sale-total rules of the POS
 * (header `totalProductsPrice` with a `shopping_carts` fallback, concluded =
 * `order_status_types.state = 4`).
 */
export class ReportDataService {
  private readonly tenant: string

  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  private get sequelize() {
    const sequelize = models.Product.sequelize
    if (!sequelize) throw new Error('Sequelize instance is not available')
    return sequelize
  }

  /**
   * Builds the DB-comparable half-open range `[startAt, endAt)` for a report
   * request from calendar dates in the business timezone.
   *
   * Convention: start is inclusive (00:00 of startDate), end is exclusive
   * (00:00 of the day after endDate). Documented here and relied upon by every
   * date-bounded query below.
   */
  private resolveRange(startDate: string, endDate: string, timezone: string): StoredRange {
    const range = getPeriodRange({ preset: 'custom', from: startDate, to: endDate, timezone })
    return {
      startAt: toStoredUtcFormat(range.startAt),
      endAt: toStoredUtcFormat(range.endAt)
    }
  }

  /**
   * Resolves a single report into a tabular result.
   *
   * @param reportId - Catalog report id.
   * @param startDate - Inclusive start calendar date (YYYY-MM-DD).
   * @param endDate - Inclusive end calendar date (YYYY-MM-DD).
   * @param timezone - Business timezone.
   * @param filters - Optional validated filter values for this report.
   * @returns A {@link ReportTable} ready for export.
   * @throws When the report id is unknown or not implemented.
   */
  async build(
    reportId: string,
    startDate: string,
    endDate: string,
    timezone: string,
    filters: ReportFilterValues = {}
  ): Promise<ReportTable> {
    const def = findReportDefinition(reportId)
    if (!def) throw new Error(`Unknown report: ${reportId}`)
    if (!def.enabled) {
      throw new Error(`Report not available: ${reportId}. ${def.disabledReason ?? ''}`.trim())
    }

    const range = this.resolveRange(startDate, endDate, timezone)
    const base = { reportId, name: def.name, columns: def.availableFields }

    switch (reportId) {
      case 'sales.summary':
        return { ...base, ...(await this.salesSummary(range)) }
      case 'sales.detail':
        return { ...base, ...(await this.salesDetail(range, filters)) }
      case 'sales.byDay':
        return { ...base, ...(await this.salesByDay(range, timezone)) }
      case 'sales.byPaymentMethod':
        return { ...base, ...(await this.salesByPaymentMethod(range)) }
      case 'sales.byProduct':
        return { ...base, ...(await this.salesByProduct(range)) }
      case 'sales.topProducts':
        return { ...base, ...(await this.salesByProduct(range, 25)) }
      case 'sales.cancelled':
        return { ...base, ...(await this.salesCancelled(range)) }
      case 'products.catalog':
        return { ...base, ...(await this.productsCatalog()) }
      case 'products.lowStock':
        return { ...base, ...(await this.productsLowStock()) }
      case 'inventory.current':
        return { ...base, ...(await this.inventoryCurrent()) }
      case 'inventory.movements':
        return { ...base, ...(await this.inventoryMovements(range, filters)) }
      case 'clients.list':
        return { ...base, ...(await this.clientsList(range)) }
      default:
        throw new Error(`Report not implemented: ${reportId}`)
    }
  }

  // ---------------------------------------------------------------- SALES

  private async salesSummary(range: StoredRange): Promise<ReportTableData> {
    const rows = await this.sequelize.query<{
      orders: number | string
      total: number | string | null
      discount: number | string | null
      tip: number | string | null
    }>(
      `
      SELECT
        COUNT(*) AS "orders",
        -- Net income: discount-aware netTotal with a fallback to the gross
        -- totalProductsPrice for legacy rows (pre discount/net columns).
        COALESCE(SUM(
          CASE
            WHEN o."netTotal" IS NOT NULL AND o."netTotal" > 0 THEN o."netTotal"
            WHEN o."totalProductsPrice" IS NOT NULL AND o."totalProductsPrice" > 0 THEN o."totalProductsPrice"
            ELSE 0
          END
        ), 0) AS "total",
        -- Gross income (before global discount), for reference.
        COALESCE(SUM(
          CASE WHEN o."totalProductsPrice" IS NOT NULL AND o."totalProductsPrice" > 0
               THEN o."totalProductsPrice" ELSE 0 END
        ), 0) AS "gross",
        -- Prefer the real money discounted (discountAmount); fall back to the
        -- legacy discount column for rows that predate it.
        COALESCE(SUM(COALESCE(o."discountAmount", o."discount", 0)), 0) AS "discount",
        COALESCE(SUM(o."tip"), 0) AS "tip"
      FROM "${this.tenant}.${STATUS_ORDER_MODEL}" o
      INNER JOIN "${this.tenant}.${ORDER_STATUS_TYPE_MODEL}" t ON o."idStatus" = t."idStatus"
      WHERE t."state" = :concluded
        AND o."createdAt" >= :startAt AND o."createdAt" < :endAt;
      `,
      { type: QueryTypes.SELECT, replacements: { concluded: ORDER_STATE_CONCLUDED, ...range } }
    )

    const r = rows[0] ?? { orders: 0, total: 0, gross: 0, discount: 0, tip: 0 }
    const orders = Number(r.orders ?? 0)
    // `total` is now the NET income (after the global discount).
    const total = Number(r.total ?? 0)
    const gross = Number((r as { gross?: number | string | null }).gross ?? 0)
    const avg = orders > 0 ? total / orders : 0

    return {
      rows: [
        { metric: 'Ventas confirmadas', value: String(orders) },
        { metric: 'Ingreso bruto', value: String(gross) },
        { metric: 'Descuentos', value: String(Number(r.discount ?? 0)) },
        { metric: 'Ingreso total', value: String(total) },
        { metric: 'Ticket promedio', value: String(Math.round(avg * 100) / 100) },
        { metric: 'Propinas', value: String(Number(r.tip ?? 0)) }
      ],
      summary: [
        { label: 'Ventas', value: orders },
        { label: 'Ingreso total', value: total }
      ]
    }
  }

  private async salesDetail(range: StoredRange, filters: ReportFilterValues): Promise<ReportTableData> {
    const paymentFilter = this.asArray(filters.paymentMethod)
    const payClause = paymentFilter.length ? 'AND o."payId" IN (:paymentIds)' : ''

    const rows = await this.sequelize.query<{
      code: string
      date: string
      total: number | string | null
      discount: number | string | null
      tip: number | string | null
      paymentMethod: string | null
      channel: number | null
    }>(
      `
      SELECT
        o."pCodeRef" AS "code",
        o."createdAt" AS "date",
        -- Net income per order (after the global discount). Falls back to gross
        -- for legacy rows without a persisted netTotal.
        COALESCE(o."netTotal", o."totalProductsPrice", 0) AS "total",
        COALESCE(o."discountAmount", o."discount", 0) AS "discount",
        COALESCE(o."tip", 0) AS "tip",
        pm."name" AS "paymentMethod",
        o."channel" AS "channel"
      FROM "${this.tenant}.${STATUS_ORDER_MODEL}" o
      INNER JOIN "${this.tenant}.${ORDER_STATUS_TYPE_MODEL}" t ON o."idStatus" = t."idStatus"
      LEFT JOIN "${this.tenant}.${PAYMENT_METHOD_MODEL}" pm ON o."payId" = pm."payId"
      WHERE t."state" = :concluded
        AND o."createdAt" >= :startAt AND o."createdAt" < :endAt
        ${payClause}
      ORDER BY o."createdAt" ASC;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          concluded: ORDER_STATE_CONCLUDED,
          ...range,
          ...(paymentFilter.length ? { paymentIds: paymentFilter } : {})
        }
      }
    )

    return {
      rows: rows.map((r) => ({
        code: r.code,
        date: r.date,
        total: Number(r.total ?? 0),
        discount: Number(r.discount ?? 0),
        tip: Number(r.tip ?? 0),
        paymentMethod: r.paymentMethod ?? 'Sin registrar',
        channel: r.channel === 1 ? 'Cliente' : 'Tienda'
      }))
    }
  }

  private async salesByDay(range: StoredRange, timezone: string): Promise<ReportTableData> {
    // Group by the local calendar day. createdAt is stored as UTC text; we group
    // by its date part which is a reasonable per-day bucket for reporting.
    const rows = await this.sequelize.query<{ day: string; orders: number | string; total: number | string | null }>(
      `
      SELECT
        SUBSTR(o."createdAt", 1, 10) AS "day",
        COUNT(*) AS "orders",
        COALESCE(SUM(COALESCE(o."netTotal", o."totalProductsPrice")), 0) AS "total"
      FROM "${this.tenant}.${STATUS_ORDER_MODEL}" o
      INNER JOIN "${this.tenant}.${ORDER_STATUS_TYPE_MODEL}" t ON o."idStatus" = t."idStatus"
      WHERE t."state" = :concluded
        AND o."createdAt" >= :startAt AND o."createdAt" < :endAt
      GROUP BY "day"
      ORDER BY "day" ASC;
      `,
      { type: QueryTypes.SELECT, replacements: { concluded: ORDER_STATE_CONCLUDED, ...range } }
    )

    return {
      rows: rows.map((r) => ({ day: r.day, orders: Number(r.orders ?? 0), total: Number(r.total ?? 0) })),
      note: `Agrupado por día (zona horaria ${timezone}).`
    }
  }

  private async salesByPaymentMethod(range: StoredRange): Promise<ReportTableData> {
    const rows = await this.sequelize.query<{ paymentMethod: string | null; orders: number | string; total: number | string | null }>(
      `
      SELECT
        COALESCE(pm."name", 'Sin registrar') AS "paymentMethod",
        COUNT(*) AS "orders",
        COALESCE(SUM(COALESCE(o."netTotal", o."totalProductsPrice")), 0) AS "total"
      FROM "${this.tenant}.${STATUS_ORDER_MODEL}" o
      INNER JOIN "${this.tenant}.${ORDER_STATUS_TYPE_MODEL}" t ON o."idStatus" = t."idStatus"
      LEFT JOIN "${this.tenant}.${PAYMENT_METHOD_MODEL}" pm ON o."payId" = pm."payId"
      WHERE t."state" = :concluded
        AND o."createdAt" >= :startAt AND o."createdAt" < :endAt
      GROUP BY "paymentMethod"
      ORDER BY "total" DESC;
      `,
      { type: QueryTypes.SELECT, replacements: { concluded: ORDER_STATE_CONCLUDED, ...range } }
    )

    return {
      rows: rows.map((r) => ({
        paymentMethod: r.paymentMethod ?? 'Sin registrar',
        orders: Number(r.orders ?? 0),
        total: Number(r.total ?? 0)
      }))
    }
  }

  private async salesByProduct(range: StoredRange, limit?: number): Promise<ReportTableData> {
    // HISTORICAL-sales semantics: this report reflects what was actually sold in
    // the period. It must NOT be filtered by the CURRENT catalog active state,
    // because a product/extra sold while active and later deactivated is still a
    // valid historical sale. The queries join the SOLD snapshots
    // (`product_models_sold`, `products_extras_sold`) — not the live catalog —
    // so no current-state filter is applied here by design.
    //
    // Base products: join concluded order headers to their line items by the
    // shared ref code, then to the sold-product snapshot for the name actually
    // sold. `sc.priceProduct` is the BASE product price only; it does NOT
    // include extras, so extra revenue is never double-counted here.
    const productRows = await this.sequelize.query<{ product: string | null; units: number | string | null; total: number | string | null }>(
      reportSql.salesByProductBase(this.tenant, SQL_MODELS),
      {
        type: QueryTypes.SELECT,
        replacements: { concluded: ORDER_STATE_CONCLUDED, ...range }
      }
    )

    // Extras sold as INDEPENDENT lines. Revenue = extraPrice * quantity from the
    // sold-extra snapshot (`products_extras_sold`), linked to concluded orders
    // by pCodeRef. The parent product name is resolved via the sold product the
    // extra belongs to. This revenue is NOT part of sc.priceProduct above, so
    // adding these rows does not duplicate any income already counted.
    const extraRows = await this.sequelize.query<{
      product: string | null
      parent: string | null
      units: number | string | null
      total: number | string | null
    }>(
      reportSql.salesByProductExtras(this.tenant, SQL_MODELS),
      {
        type: QueryTypes.SELECT,
        replacements: { concluded: ORDER_STATE_CONCLUDED, ...range }
      }
    )

    const rows = combineSalesByProductRows(productRows, extraRows, limit)

    return {
      rows,
      note:
        'Los complementos se listan como líneas independientes (Tipo = Complemento). Su ingreso no está incluido en la fila del producto principal, por lo que no se duplica.'
    }
  }

  private async salesCancelled(range: StoredRange): Promise<ReportTableData> {
    const rows = await this.sequelize.query<{ code: string; date: string; status: number | string | null; total: number | string | null }>(
      `
      SELECT
        o."pCodeRef" AS "code",
        o."createdAt" AS "date",
        t."state" AS "status",
        COALESCE(o."totalProductsPrice", 0) AS "total"
      FROM "${this.tenant}.${STATUS_ORDER_MODEL}" o
      INNER JOIN "${this.tenant}.${ORDER_STATUS_TYPE_MODEL}" t ON o."idStatus" = t."idStatus"
      WHERE t."state" <> :concluded
        AND o."createdAt" >= :startAt AND o."createdAt" < :endAt
      ORDER BY o."createdAt" ASC;
      `,
      { type: QueryTypes.SELECT, replacements: { concluded: ORDER_STATE_CONCLUDED, ...range } }
    )

    return {
      rows: rows.map((r) => ({
        code: r.code,
        date: r.date,
        status: `Estado ${Number(r.status ?? 0)}`,
        total: Number(r.total ?? 0)
      })),
      note: 'Pedidos no confirmados (estado distinto de concluido). No cuentan como ventas.'
    }
  }

  // ------------------------------------------------------------- PRODUCTS

  private async productsCatalog(): Promise<ReportTableData> {
    const rows = await this.sequelize.query<{
      code: string | null
      name: string | null
      price: number | string | null
      vat: number | string | null
      stock: number | string | null
      manageStock: boolean | number | null
      pState: number | string | null
    }>(
      reportSql.catalogProducts(this.tenant, SQL_MODELS),
      { type: QueryTypes.SELECT }
    )

    // All complementos (extras), regardless of manageStock, appear in the
    // catalog as independent items. Extras have no VAT in the model (vat = 0)
    // and their active flag is derived from exState = 1.
    const extras = await this.sequelize.query<{
      code: string | null
      name: string | null
      price: number | string | null
      stock: number | string | null
      manageStock: boolean | number | null
      exState: number | string | null
    }>(
      reportSql.catalogExtras(this.tenant, SQL_MODELS),
      { type: QueryTypes.SELECT }
    )

    return {
      rows: [
        ...rows.map((r) => ({
          type: 'Producto',
          code: r.code ?? '',
          name: r.name ?? '',
          price: Number(r.price ?? 0),
          vat: Number(r.vat ?? 0),
          stock: Number(r.stock ?? 0),
          manageStock: Boolean(r.manageStock),
          active: Number(r.pState ?? 0) === 1
        })),
        ...extras.map((r) => ({
          type: 'Complemento',
          code: r.code ?? '',
          name: r.name ?? '',
          price: Number(r.price ?? 0),
          vat: 0,
          stock: Number(r.stock ?? 0),
          manageStock: Boolean(r.manageStock),
          active: Number(r.exState ?? 0) === 1
        }))
      ]
    }
  }

  private async productsLowStock(): Promise<ReportTableData> {
    const rows = await this.sequelize.query<{ code: string | null; name: string | null; stock: number | string | null }>(
      reportSql.lowStockProducts(this.tenant, SQL_MODELS),
      { type: QueryTypes.SELECT, replacements: { threshold: LOW_STOCK_THRESHOLD, active: STATE_ACTIVE } }
    )

    // Only ACTIVE complementos that manage stock can be "low stock"; extras with
    // manageStock=false are not inventory-controlled, and inactive/archived
    // extras are not current inventory, so neither must appear here.
    const extras = await this.sequelize.query<{ code: string | null; name: string | null; stock: number | string | null }>(
      reportSql.lowStockExtras(this.tenant, SQL_MODELS),
      { type: QueryTypes.SELECT, replacements: { threshold: LOW_STOCK_THRESHOLD, active: STATE_ACTIVE } }
    )

    return {
      rows: [
        ...rows.map((r) => ({ type: 'Producto', code: r.code ?? '', name: r.name ?? '', stock: Number(r.stock ?? 0) })),
        ...extras.map((r) => ({ type: 'Complemento', code: r.code ?? '', name: r.name ?? '', stock: Number(r.stock ?? 0) }))
      ],
      note: `Umbral de stock bajo: ${LOW_STOCK_THRESHOLD} unidades. Incluye complementos que gestionan inventario.`
    }
  }

  // ------------------------------------------------------------ INVENTORY

  private async inventoryCurrent(): Promise<ReportTableData> {
    // Products managing stock. CURRENT-inventory semantics: only ACTIVE
    // products (pState = 1) that manage stock count as available inventory.
    // Inactive/archived products are excluded from current stock.
    const products = await this.sequelize.query<{
      code: string | null
      name: string | null
      stock: number | string | null
      price: number | string | null
    }>(
      reportSql.inventoryCurrentProducts(this.tenant, SQL_MODELS),
      { type: QueryTypes.SELECT, replacements: { active: STATE_ACTIVE } }
    )

    // Complementos (extras) that manage their own inventory. Extras have no
    // `pCode`; the exPid is used as the identifying code. Only ACTIVE
    // (exState = 1) extras with manageStock=true are real current inventory
    // (manageStock=false are NOT stock-controlled; inactive are not available).
    const extras = await this.sequelize.query<{
      code: string | null
      name: string | null
      stock: number | string | null
      price: number | string | null
    }>(
      reportSql.inventoryCurrentExtras(this.tenant, SQL_MODELS),
      { type: QueryTypes.SELECT, replacements: { active: STATE_ACTIVE } }
    )

    const toRow = (type: string) => (r: { code: string | null; name: string | null; stock: number | string | null; price: number | string | null }) => {
      const stock = Number(r.stock ?? 0)
      const price = Number(r.price ?? 0)
      return {
        type,
        code: r.code ?? '',
        name: r.name ?? '',
        stock,
        price,
        value: Math.round(stock * price * 100) / 100
      }
    }

    return {
      rows: [
        ...products.map(toRow('Producto')),
        ...extras.map(toRow('Complemento'))
      ],
      note: 'Valor estimado = stock × precio de venta (no es costo de adquisición). Incluye complementos que gestionan inventario.'
    }
  }

  private async inventoryMovements(range: StoredRange, filters: ReportFilterValues): Promise<ReportTableData> {
    const typeFilter = this.asArray(filters.movementType)
    const typeClause = typeFilter.length ? 'AND h."type" IN (:types)' : ''

    // Join product and extra names so each movement is identifiable. Extras live
    // in the same stock_history table keyed by exPid.
    const rows = await this.sequelize.query<{
      date: string
      product: string | null
      type: string
      delta: number | string
      meta: string | null
    }>(
      `
      SELECT h."createdAt" AS "date",
             COALESCE(p."pName", e."extraName", h."pId") AS "product",
             h."type" AS "type",
             h."delta" AS "delta",
             h."meta" AS "meta"
      FROM "${this.tenant}.stock_history" h
      LEFT JOIN "${this.tenant}.${PRODUCT_MODEL}" p ON p."pId" = h."pId"
      LEFT JOIN "${this.tenant}.${EXTRA_PRODUCT_MODEL}" e ON e."exPid" = h."pId"
      WHERE h."createdAt" >= :startAt AND h."createdAt" < :endAt
        ${typeClause}
      ORDER BY h."createdAt" ASC;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { ...range, ...(typeFilter.length ? { types: typeFilter } : {}) }
      }
    )

    const typeLabels: Record<string, string> = {
      RESTOCK: 'Entrada',
      DECREMENT: 'Salida por venta',
      ADJUST: 'Ajuste',
      RESERVE: 'Reserva',
      RELEASE: 'Liberación'
    }

    return {
      rows: rows.map((r) => {
        let reference = ''
        if (r.meta) {
          try {
            const meta = JSON.parse(r.meta) as Record<string, unknown>
            reference = String(meta.reference ?? meta.pCodeRef ?? meta.requested ?? '')
          } catch {
            reference = ''
          }
        }
        return {
          date: r.date,
          product: r.product ?? '',
          type: typeLabels[r.type] ?? r.type,
          delta: Number(r.delta ?? 0),
          reference
        }
      }),
      note:
        'Movimientos reales del historial de inventario. El inventario histórico no se infiere desde el stock actual.'
    }
  }

  // -------------------------------------------------------------- CLIENTS

  private async clientsList(range: StoredRange): Promise<ReportTableData> {
    const rows = await this.sequelize.query<{
      clientName: string | null
      clientLastName: string | null
      ccClient: string | null
      clientNumber: string | null
      email: string | null
      createdAt: string
    }>(
      `
      SELECT "clientName", "clientLastName", "ccClient", "clientNumber", "email", "createdAt"
      FROM "${this.tenant}.${CLIENTS_TABLE}"
      WHERE "clState" <> -1
        AND "createdAt" >= :startAt AND "createdAt" < :endAt
      ORDER BY "createdAt" DESC;
      `,
      { type: QueryTypes.SELECT, replacements: { ...range } }
    )

    return {
      rows: rows.map((r) => ({
        name: `${r.clientName ?? ''} ${r.clientLastName ?? ''}`.trim(),
        document: r.ccClient ?? '',
        phone: r.clientNumber ?? '',
        email: r.email ?? '',
        createdAt: r.createdAt
      }))
    }
  }

  /**
   * Normalizes a filter value into a string array.
   */
  private asArray(value: string | string[] | undefined): string[] {
    if (!value) return []
    return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean)
  }
}
