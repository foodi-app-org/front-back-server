import { Op, QueryTypes } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { DateRange } from '../../../../shared/utils/date-range.utils'
import { SHOPPING_CART_MODEL } from '../../../shopping/infrastructure/db/sequelize/models/sequelize-shopping-cart.model'
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
   * Per-order revenue prefers the header total `orders_statuses.totalProductsPrice`,
   * but falls back to the sum of the order's line items (`shopping_carts`) when
   * the header is 0 or null. Some order-creation flows leave the header at 0
   * while still writing priced line items, which made this KPI show $0 even
   * though the sale existed. This keeps it consistent with the commercial
   * dashboard's Sales-by-Category / Revenue widgets.
   *
   * Only orders whose status type is CONCLUIDA (`state = 4`) are counted.
   */
  async countSalesAmountToday(start: Date, end: Date): Promise<number> {
    const { start: startOfDay, end: endOfDay } = this.dateRange.getRange({ start, end })
    const sequelize = models.StatusOrder.sequelize

    if (!sequelize) {
      throw new Error('Sequelize instance is not available')
    }

    const table = (name: string): string => `"${this.tenant}.${name}"`

    try {
      const rows = await sequelize.query<{ total: number | string | null }>(
        `
        SELECT SUM(
          COALESCE(
            NULLIF(o."totalProductsPrice", 0),
            (
              SELECT SUM(sc."priceProduct" * COALESCE(sc."cantProducts", 1))
              FROM ${table(SHOPPING_CART_MODEL)} sc
              WHERE sc."shoppingCartRefCode" = o."shoppingCartRefCode"
            ),
            0
          )
        ) AS "total"
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