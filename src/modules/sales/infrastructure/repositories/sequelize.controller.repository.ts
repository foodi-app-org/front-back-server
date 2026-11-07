import { Op, QueryTypes } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { DateRange } from '../../../../shared/utils/date-range.utils'
import { STATUS_ORDER_MODEL } from '../../../status_order/infrastructure/db/sequelize/models/sequelize-status_orders.model'
import { ORDER_STATUS_TYPE_MODEL } from '../../../status_order_types/infrastructure/db/sequelize/models/sequelize-status_orders_types.model'
import { SalesRepository } from '../../domain/repositories/sales.repository'

/** A completed order (CONCLUIDA) has `order_status_types.state = 4`. */
const ORDER_STATE_CONCLUDED = 4

export class SequelizeSalesRepository implements SalesRepository {
  private readonly dateRange: DateRange
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.dateRange = new DateRange()
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async countSales(start: Date, end: Date): Promise<number> {
    // use dateRange to get start/end of day
    const { start: startOfDay, end: endOfDay } = this.dateRange.getRange({ start, end })

    try {
      const result = await models.StatusOrder.schema(this.tenant).count({
        where: {
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay
          }
        }
      })
      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  /**
   * Sums today's revenue for concluded orders.
   *
   * Per-order revenue is read directly from the persisted header
   * `orders_statuses.totalProductsPrice`, which `registerSalesStore` now
   * computes once at sale time as base (priceProduct * cantProducts) + extras
   * (extraPrice * quantity). Reading the header is O(1) per row and avoids the
   * previous correlated subqueries over shopping_carts and
   * products_extras_sold. The "today" definition (createdAt within
   * DateRange.getRange) and the CONCLUIDA filter (`order_status_types.state =
   * 4`) are preserved exactly as before.
   */
  async countSalesAmountToday(start: Date, end: Date): Promise<number> {
    const { start: startOfDay, end: endOfDay } = this.dateRange.getRange({ start, end })
    const sequelize = models.StatusOrder.sequelize

    if (!sequelize) {
      throw new Error('Sequelize instance is not available')
    }

    const table = (name: string): string => `"${this.tenant}.${name}"`

    try {
      // Net income = totalProductsPrice (gross) minus the global discount.
      // `netTotal` is the discount-aware figure persisted at sale time; for
      // legacy rows (pre-migration / pre-backfill) it is NULL, so we fall back
      // to the gross `totalProductsPrice` to preserve the historical behavior.
      const rows = await sequelize.query<{ total: number | string | null }>(
        `
        SELECT COALESCE(SUM(COALESCE(o."netTotal", o."totalProductsPrice")), 0) AS "total"
        FROM ${table(STATUS_ORDER_MODEL)} o
        INNER JOIN ${table(ORDER_STATUS_TYPE_MODEL)} t
          ON o."idStatus" = t."idStatus"
        WHERE t."state" = :concluded
          AND o."createdAt" >= :startAt
          AND o."createdAt" <= :endAt;
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            concluded: ORDER_STATE_CONCLUDED,
            startAt: startOfDay,
            endAt: endOfDay
          }
        }
      )

      const total = Number(rows?.[0]?.total ?? 0)
      return Number.isFinite(total) ? total : 0
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

}