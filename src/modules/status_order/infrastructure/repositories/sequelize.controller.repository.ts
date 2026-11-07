import { QueryTypes, Transaction } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { StatusOrder, StatusOrderPagination } from '../../domain/entities/status_order.entity'
import { GetAllByStatusTypeFilters, StatusOrderRepository } from '../../domain/repositories/status_order.repository'
import type { SequelizeStatusOrderModel } from '../db/sequelize/models/sequelize-status_orders.model'
import { connect } from '../../../../shared/infrastructure/db'

export class SequelizeStatusOrderRepository implements StatusOrderRepository {
  private readonly genericService: GenericService<SequelizeStatusOrderModel>
  private readonly tenant: string

  constructor(tenant: string) {
    this.genericService = new GenericService(models.StatusOrder.schema(tenant))
    this.tenant = tenant || MigrationFolder.Public
  }

  async create(data: StatusOrder, transaction?: Transaction): Promise<StatusOrder | null> {
    try {
      const created = await models.StatusOrder.schema(this.tenant).create({
        ...data
      }, { transaction })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findCodeRef(pCodeRef: string): Promise<StatusOrder | null> {
    try {
      const status = await models.StatusOrder
        .schema(this.tenant)
        .findOne({
          where: { pCodeRef },
          raw: true
        })
      return status
    } catch (e: any) {
      throw new Error(e.message || String(e));
    }
  }



  async getAll(idStore: string): Promise<StatusOrderPagination | null> {
    try {
      const result = await this.genericService.getAll({
        searchFields: ['pCodeRef'],
        idStore
      })

      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async findById(id: string): Promise<StatusOrder | null> {
    try {
      const statusOrder = await models.StatusOrder.schema(this.tenant).findOne({ where: { stPId: id } })
      if (!statusOrder) {
        return null
      }
      return statusOrder
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async getAllByStatusType(filters?: GetAllByStatusTypeFilters): Promise<any[] | null> {
    try {
      const sequelize = connect()
      // Per-order revenue prefers the header total `orders_statuses.totalProductsPrice`,
      // but falls back to the sum of the order's line items (`shopping_carts`)
      // when the header is 0 or null. Some order-creation flows leave the header
      // at 0 while still writing priced line items, which made consumers (e.g.
      // the sales-by-month chart) show $0 even though the sale existed.
      //
      // `pDatCre` is exposed as an alias of `createdAt` because the GraphQL
      // `StoreOrders` type and its clients read `pDatCre`, not `createdAt`.
      //
      // Optional filters (search / date range) are applied with bind
      // parameters to avoid SQL injection. Each filter is only added to the
      // WHERE clause when a value is provided.
      const conditions: string[] = []
      const replacements: Record<string, unknown> = {}

      if (filters?.search) {
        conditions.push('os."pCodeRef" ILIKE :search')
        replacements.search = `%${filters.search}%`
      }
      if (filters?.fromDate) {
        conditions.push('os."createdAt" >= :fromDate')
        replacements.fromDate = filters.fromDate
      }
      if (filters?.toDate) {
        conditions.push('os."createdAt" <= :toDate')
        replacements.toDate = filters.toDate
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

      const query = `
            SELECT 
        ost.name AS status,
        os.stPId,
        os.idStatus,
        os.pCodeRef,
        os.pSState,
        COALESCE(
          NULLIF(os.totalProductsPrice, 0),
          (
            SELECT SUM(sc."priceProduct" * COALESCE(sc."cantProducts", 1))
            FROM "${this.tenant}.shopping_carts" AS sc
            WHERE sc."shoppingCartRefCode" = os."shoppingCartRefCode"
          ),
          0
        ) AS "totalProductsPrice",
        os."discountType" AS "discountType",
        os."discountValue" AS "discountValue",
        os."discountAmount" AS "discountAmount",
        -- Net income persisted at sale time; fall back to the gross header
        -- total (then to the line-items reconstruction) for legacy rows.
        COALESCE(
          os."netTotal",
          NULLIF(os.totalProductsPrice, 0),
          (
            SELECT SUM(sc2."priceProduct" * COALESCE(sc2."cantProducts", 1))
            FROM "${this.tenant}.shopping_carts" AS sc2
            WHERE sc2."shoppingCartRefCode" = os."shoppingCartRefCode"
          ),
          0
        ) AS "netTotal",
        os.createdAt,
        os.createdAt AS "pDatCre",
        os.updatedAt,
        os.updatedAt AS "pDatMod"
      FROM "${this.tenant}.order_status_types" AS ost
      INNER JOIN "${this.tenant}.orders_statuses" AS os
      ON os.idStatus = ost.idStatus
      ${whereClause}
      `
      type StatusRow = {
        status: string
        stPId: string
        idStatus: number
        pCodeRef: string
        pSState: string
        totalProductsPrice: number
        discountType: string | null
        discountValue: number | null
        discountAmount: number | null
        netTotal: number | null
        createdAt: Date | string
        pDatCre: Date | string
        updatedAt: Date | string
        pDatMod: Date | string
      }
      const results = await sequelize.query<StatusRow>(query, {
        type: QueryTypes.SELECT,
        replacements
      })
      return results
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}