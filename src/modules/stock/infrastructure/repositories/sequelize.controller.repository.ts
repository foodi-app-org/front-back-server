
import { QueryTypes, Transaction } from 'sequelize'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { StockMovement } from '../../domain/entities/stock.entity'
import { IStockMovementRepository, TopProductMovement } from '../../domain/repositories/stock.repository'
import { PRODUCT_MODEL } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product.model'
import { EXTRA_PRODUCT_MODEL } from '@modules/product_extra/infrastructure/db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra.model'
import { STOCK_HISTORY_MODEL } from '@modules/stock/infrastructure/db/sequelize/models/sequelize-stock-history.model'
import { STATUS_ORDER_MODEL } from '@modules/status_order/infrastructure/db/sequelize/models/sequelize-status_orders.model'
import { ORDER_STATUS_TYPE_MODEL } from '@modules/status_order_types/infrastructure/db/sequelize/models/sequelize-status_orders_types.model'
import { ProductStockRow } from '@modules/stock/domain/types'
import { MigrationFolder } from '@shared/infrastructure/db/sequelize/migrations/umzug.config'
import { toStoredUtcFormat } from '@shared/utils/period-range.utils'
import {
  StockMovementSummary,
  TotalSalesResult,
  WeeklyStockChange
} from '../../domain/repositories/stock.repository'

/**
 * Normalizes an ISO UTC bound into the DB-stored text format, or returns null
 * when the value is missing/invalid so callers can skip the date filter.
 *
 * @param value - ISO UTC string (or null/undefined).
 * @returns Stored-format UTC string, or null.
 */
const normalizeStoredUtc = (value?: string | null): string | null => {
  if (typeof value !== 'string' || value.trim() === '') return null
  return toStoredUtcFormat(value)
}

// Negative-delta DECREMENT rows in `stock_history` represent outgoing stock (sales).
const STOCK_HISTORY_DECREMENT = 'DECREMENT'
// The real order state lives in `orders_statuses.idStatus` (UUID -> order_status_types),
// NOT in `pSState` (only an ACTIVE/INACTIVE flag). A completed sale has state = 4.
const ORDER_STATE_CONCLUDED = 4

export class SequelizeStockRepository implements IStockMovementRepository {
  private readonly tenant: string

  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  /**
   * Enables/disables inventory control (`manageStock`) for a MAIN product.
   *
   * - Enabling: keeps the current stock (restoring `previousStock` if the
   *   current is empty), so the product re-enters inventory with its last
   *   known quantity.
   * - Disabling: snapshots the current stock into `previousStock` and zeroes
   *   `stock`, so the product stops counting as managed inventory without
   *   losing the value to restore later.
   *
   * Operates on `product_models` (main products). Extras use their own edit
   * flow (editExtraProductFoods). Returns the updated row or null when missing.
   */
  updateProductManageStock = async (
    pId: string,
    manageStock: boolean
  ): Promise<{ pId: string; manageStock: boolean; stock: number; previousStock: number } | null> => {
    const ProductModel = models.Product.schema(this.tenant)
    const product: any = await ProductModel.findOne({ where: { pId } })
    if (!product) return null

    const currentStock = Number(product.get('stock') ?? 0)
    const prevStock = Number(product.get('previousStock') ?? 0)

    const patch = manageStock
      ? { manageStock: true, stock: currentStock || prevStock || 0 }
      : { manageStock: false, stock: 0, previousStock: currentStock }

    await product.update(patch)

    return {
      pId: String(product.get('pId')),
      manageStock: Boolean(product.get('manageStock')),
      stock: Number(product.get('stock') ?? 0),
      previousStock: Number(product.get('previousStock') ?? 0)
    }
  }

  async create(data: Omit<StockMovement, 'createdAt' | 'updatedAt'>): Promise<StockMovement | null> {
    try {
      const created = await models.StockMovement.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return created as StockMovement
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  startTransaction = async (): Promise<Transaction> => {
    // models.Product.sequelize should exist
    if (!models.Product.sequelize) {
      throw new Error('Sequelize instance is not available')
    }
    return await models.Product.sequelize.transaction()
  }

  findByIdForUpdate = async (pId: string, transaction?: Transaction): Promise<ProductStockRow | null> => {
    const options: any = {
      where: { pId },
      attributes: ['pId', 'stock', 'manageStock', 'previousStock', 'ProQuantity'],
      transaction
    }
    if (transaction) options.lock = transaction.LOCK.UPDATE
    const row = await models.Product.schema(this.tenant).findOne(options)
    if (!row) return null
    return row.get({ plain: true }) as ProductStockRow
  }

  updateStock = async (pId: string, newStock: number, previousStock: number, transaction?: Transaction): Promise<void> => {
    const updateOptions: any = { where: { pId }, transaction }
    await models.Product.schema(this.tenant).update({ stock: newStock, previousStock }, updateOptions)
  }

  createStockHistory = async (
    payload: { pId: string; delta: number; type: 'RESERVE' | 'RELEASE' | 'DECREMENT' | 'RESTOCK' | 'ADJUST'; meta?: Record<string, unknown> },
    transaction?: Transaction
  ): Promise<void> => {
    const historyData = {
      id: undefined,
      pId: payload.pId,
      delta: payload.delta,
      type: payload.type,
      meta: JSON.stringify(payload.meta ?? {}),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await models.StockHistory.schema(this.tenant).create(historyData, { transaction })
  }

  getStock = async (pId: string): Promise<number | null> => {
    const row = await models.Product.schema(this.tenant).findOne({
      where: { pId },
      attributes: ['stock']
    })
    if (!row) return null
    return Number(row.get('stock'))
  }

  findTopProductsMovements = async (limit = 10): Promise<TopProductMovement[]> => {
    const sequelize = models.Product.sequelize
    if (!sequelize) {
      throw new Error('Sequelize instance is not available')
    }

    // Sales consumption is recorded in `stock_history` as negative-delta
    // DECREMENT rows (the modular sales flow never writes to `stock_movements`),
    // so the ranking must read from `stock_history` to reflect real sales.
    // Unified ranking of products and extras. Extra movements live in the same
    // stock_history table (pId = exPid), so both sources are UNIONed to reflect
    // real product + extra consumption.
    const query = `
      SELECT "productName", "totalMovements", "idProduct"
      FROM (
        SELECT
          p."pName" AS "productName",
          COALESCE(SUM(-h."delta"), 0) AS "totalMovements",
          p."pId" AS "idProduct"
        FROM "${this.tenant}.${PRODUCT_MODEL}" p
        INNER JOIN "${this.tenant}.${STOCK_HISTORY_MODEL}" h
          ON p."pId" = h."pId"
          AND h."type" = :decrementType
        GROUP BY p."pId", p."pName"
        HAVING SUM(-h."delta") > 0

        UNION ALL

        SELECT
          e."extraName" AS "productName",
          COALESCE(SUM(-h."delta"), 0) AS "totalMovements",
          e."exPid" AS "idProduct"
        FROM "${this.tenant}.${EXTRA_PRODUCT_MODEL}" e
        INNER JOIN "${this.tenant}.${STOCK_HISTORY_MODEL}" h
          ON e."exPid" = h."pId"
          AND h."type" = :decrementType
        GROUP BY e."exPid", e."extraName"
        HAVING SUM(-h."delta") > 0
      ) AS ranked
      ORDER BY "totalMovements" DESC
      LIMIT :limit;
    `

    const rows = await sequelize.query<{ productName: string; totalMovements: number | string; idProduct: string | null }>(
      query,
      {
        type: QueryTypes.SELECT,
        replacements: { decrementType: STOCK_HISTORY_DECREMENT, limit }
      }
    )

    return rows.map((row) => ({
      productName: row.productName,
      totalMovements: Number(row.totalMovements ?? 0),
      idProduct: row.idProduct ?? null
    }))
  }

  findTotalSales = async (): Promise<TotalSalesResult> => {
    const sequelize = models.Product.sequelize
    if (!sequelize) throw new Error('Sequelize instance is not available')

    try {
      const rows = await sequelize.query<{ totalSales: number | string | null }>(
        `
        SELECT COALESCE(SUM(o."totalProductsPrice"), 0) AS "totalSales"
        FROM "${this.tenant}.${STATUS_ORDER_MODEL}" o
        INNER JOIN "${this.tenant}.${ORDER_STATUS_TYPE_MODEL}" t
          ON o."idStatus" = t."idStatus"
        WHERE t."state" = :concluded
          AND o."totalProductsPrice" IS NOT NULL;
        `,
        { type: QueryTypes.SELECT, replacements: { concluded: ORDER_STATE_CONCLUDED } }
      )

      return {
        success: true,
        message: 'Total sales calculated successfully',
        totalSales: Number(rows[0]?.totalSales ?? 0)
      }
    } catch {
      return {
        success: false,
        message: 'An error occurred while calculating total sales.',
        totalSales: null
      }
    }
  }

  findTotalSalesSold = async (): Promise<number> => {
    const sequelize = models.Product.sequelize
    if (!sequelize) throw new Error('Sequelize instance is not available')

    const rows = await sequelize.query<{ totalProductsSold: number | string }>(
      `
      SELECT COUNT(*) AS "totalProductsSold"
      FROM "${this.tenant}.${STATUS_ORDER_MODEL}" o
      INNER JOIN "${this.tenant}.${ORDER_STATUS_TYPE_MODEL}" t
        ON o."idStatus" = t."idStatus"
      WHERE t."state" = :concluded;
      `,
      { type: QueryTypes.SELECT, replacements: { concluded: ORDER_STATE_CONCLUDED } }
    )

    return Number(rows[0]?.totalProductsSold ?? 0)
  }

  findTotalProductsSold = async (): Promise<number> => {
    const sequelize = models.Product.sequelize
    if (!sequelize) throw new Error('Sequelize instance is not available')

    // Total units that left inventory (sum of negative-delta DECREMENT rows).
    const rows = await sequelize.query<{ totalProductsSold: number | string | null }>(
      `
      SELECT COALESCE(SUM(-h."delta"), 0) AS "totalProductsSold"
      FROM "${this.tenant}.${STOCK_HISTORY_MODEL}" h
      WHERE h."type" = :decrementType;
      `,
      { type: QueryTypes.SELECT, replacements: { decrementType: STOCK_HISTORY_DECREMENT } }
    )

    return Number(rows[0]?.totalProductsSold ?? 0)
  }

  findTotalProductsInStock = async (): Promise<number> => {
    const sequelize = models.Product.sequelize
    if (!sequelize) throw new Error('Sequelize instance is not available')

    // Managed units in stock across products + extras.
    const rows = await sequelize.query<{ totalProductsInStock: number | string | null }>(
      `
      SELECT
        (
          SELECT COALESCE(SUM("stock"), 0)
          FROM "${this.tenant}.${PRODUCT_MODEL}"
          WHERE "stock" > 0 AND "manageStock" = true AND "pState" = 1
        ) + (
          SELECT COALESCE(SUM("stock"), 0)
          FROM "${this.tenant}.${EXTRA_PRODUCT_MODEL}"
          WHERE "stock" > 0 AND "manageStock" = true AND "exState" = 1
        ) AS "totalProductsInStock";
      `,
      { type: QueryTypes.SELECT }
    )

    return Number(rows[0]?.totalProductsInStock ?? 0)
  }

  findStockMovementsByDay = async (
    range?: { startAt?: string | null; endAt?: string | null }
  ): Promise<StockMovementSummary[]> => {
    const sequelize = models.Product.sequelize
    if (!sequelize) throw new Error('Sequelize instance is not available')

    // Optional half-open date filter [startAt, endAt). Bounds are normalized to
    // the DB's stored UTC text shape so lexicographic comparison on the text
    // `createdAt` column is correct across SQLite (dev) and PostgreSQL (prod).
    const startAt = normalizeStoredUtc(range?.startAt)
    const endAt = normalizeStoredUtc(range?.endAt)
    const dateFilter = startAt && endAt
      ? 'AND h."createdAt" >= :startAt AND h."createdAt" < :endAt'
      : ''

    // Daily IN/OUT/ADJUSTMENT totals derived from `stock_history`.
    // Direction model used by the chart (IN / OUT / ADJUST):
    //  - IN  = RESTOCK (entries/replenishment) + RELEASE (stock returned by a
    //          reversal). Both add physical stock back, so both are inbound.
    //  - OUT = DECREMENT (confirmed sale/consumption). RESERVE is a temporary
    //          hold that later becomes a DECREMENT, so it is intentionally NOT
    //          counted here to avoid double counting outbound movement.
    //  - ADJUST = manual physical/administrative corrections.
    const rows = await sequelize.query<{ date: string; total_in: number | string; total_out: number | string; total_adjustment: number | string }>(
      `
      SELECT
        DATE(h."createdAt") AS "date",
        COALESCE(SUM(CASE WHEN h."type" IN ('RESTOCK', 'RELEASE') THEN h."delta" ELSE 0 END), 0) AS "total_in",
        COALESCE(SUM(CASE WHEN h."type" = :decrementType THEN -h."delta" ELSE 0 END), 0) AS "total_out",
        COALESCE(SUM(CASE WHEN h."type" = 'ADJUST' THEN h."delta" ELSE 0 END), 0) AS "total_adjustment"
      FROM "${this.tenant}.${STOCK_HISTORY_MODEL}" h
      WHERE 1 = 1 ${dateFilter}
      GROUP BY "date"
      ORDER BY "date" ASC;
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          decrementType: STOCK_HISTORY_DECREMENT,
          ...(startAt && endAt ? { startAt, endAt } : {})
        }
      }
    )

    return rows.map((row) => ({
      date: row.date,
      total_in: Number(row.total_in ?? 0),
      total_out: Number(row.total_out ?? 0),
      total_adjustment: Number(row.total_adjustment ?? 0)
    }))
  }

  findStockMovementWeeklyComparison = async (): Promise<WeeklyStockChange[]> => {
    const sequelize = models.Product.sequelize
    if (!sequelize) throw new Error('Sequelize instance is not available')

    const rows = await sequelize.query<{ week_start: string; total_out: number | string; prev_total_out: number | string | null; percentage_change: number | string | null }>(
      `
      WITH weekly_data AS (
        SELECT
          DATE("createdAt", 'weekday 0', '-6 days') AS week_start,
          SUM(CASE WHEN "type" = :decrementType THEN -"delta" ELSE 0 END) AS total_out
        FROM "${this.tenant}.${STOCK_HISTORY_MODEL}"
        GROUP BY week_start
        ORDER BY week_start
      )
      SELECT
        week_start,
        total_out,
        LAG(total_out) OVER (ORDER BY week_start) AS prev_total_out,
        CASE
          WHEN LAG(total_out) OVER (ORDER BY week_start) IS NULL THEN NULL
          WHEN LAG(total_out) OVER (ORDER BY week_start) = 0 THEN 100
          ELSE ROUND(
            ((total_out - LAG(total_out) OVER (ORDER BY week_start)) /
            CAST(LAG(total_out) OVER (ORDER BY week_start) AS FLOAT)) * 100, 2
          )
        END AS percentage_change
      FROM weekly_data;
      `,
      { type: QueryTypes.SELECT, replacements: { decrementType: STOCK_HISTORY_DECREMENT } }
    )

    return rows.map((row) => ({
      weekStart: row.week_start ?? null,
      totalOut: row.total_out === null || row.total_out === undefined ? null : Number(row.total_out),
      prevTotalOut: row.prev_total_out === null || row.prev_total_out === undefined ? null : Number(row.prev_total_out),
      percentageChange: row.percentage_change === null || row.percentage_change === undefined ? null : Number(row.percentage_change)
    }))
  }
}