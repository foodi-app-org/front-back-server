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
    try { return await models.StatusOrder.schema(this.tenant).create({ ...data }, { transaction }) }
    catch (e) { throw new Error(e instanceof Error ? e.message : String(e)) }
  }

  async findCodeRef(pCodeRef: string): Promise<StatusOrder | null> {
    try { return await models.StatusOrder.schema(this.tenant).findOne({ where: { pCodeRef }, raw: true }) }
    catch (e) { throw new Error(e instanceof Error ? e.message : String(e)) }
  }

  async getAll(idStore: string): Promise<StatusOrderPagination | null> {
    try { return await this.genericService.getAll({ searchFields: ['pCodeRef'], idStore }) }
    catch (e) { throw new Error(e instanceof Error ? e.message : String(e)) }
  }

  async findById(id: string): Promise<StatusOrder | null> {
    try { return await models.StatusOrder.schema(this.tenant).findOne({ where: { stPId: id } }) }
    catch (e) { throw new Error(e instanceof Error ? e.message : String(e)) }
  }

  async getAllByStatusType(filters?: GetAllByStatusTypeFilters): Promise<any[] | null> {
    const sequelize = connect()
    const generator = sequelize.getQueryInterface().queryGenerator
    // @ts-ignore
    const quote = (tableName: string) => generator.quoteTable({ schema: this.tenant, tableName })
    const ordersTable = quote('orders_statuses')
    const typesTable = quote('order_status_types')
    const cartsTable = quote('shopping_carts')
    const where: string[] = []
    const replacements: Record<string, unknown> = {}
    if (filters?.idStore) { where.push('os."idStore" = :idStore'); replacements.idStore = filters.idStore }
    if (filters?.search) {
      const compare = sequelize.getDialect() === 'postgres' ? 'ILIKE' : 'LIKE'
      where.push(`os."pCodeRef" ${compare} :search`)
      replacements.search = `%${filters.search}%`
    }
    if (filters?.fromDate) { where.push('os."createdAt" >= :fromDate'); replacements.fromDate = filters.fromDate }
    if (filters?.toDate) { where.push('os."createdAt" <= :toDate'); replacements.toDate = filters.toDate }
    if (filters?.channel !== undefined) { where.push('os."channel" = :channel'); replacements.channel = filters.channel }

    const query = `
      SELECT
        ost."name" AS "status",
        os."stPId", os."idStatus", os."boardStatusId", os."pCodeRef", os."pSState", os."idStore",
        COALESCE(NULLIF(os."totalProductsPrice", 0), (
          SELECT SUM(sc."priceProduct" * COALESCE(sc."cantProducts", 1))
          FROM ${cartsTable} AS sc WHERE sc."shoppingCartRefCode" = os."shoppingCartRefCode"
        ), 0) AS "totalProductsPrice",
        os."discountType", os."discountValue", os."discountAmount",
        COALESCE(os."netTotal", NULLIF(os."totalProductsPrice", 0), (
          SELECT SUM(sc2."priceProduct" * COALESCE(sc2."cantProducts", 1))
          FROM ${cartsTable} AS sc2 WHERE sc2."shoppingCartRefCode" = os."shoppingCartRefCode"
        ), 0) AS "netTotal",
        os."createdAt", os."createdAt" AS "pDatCre",
        os."updatedAt", os."updatedAt" AS "pDatMod"
      FROM ${ordersTable} AS os
      LEFT JOIN ${typesTable} AS ost
        ON ost."idStatus" = COALESCE(os."boardStatusId", os."idStatus")
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY ost."priority" ASC, os."createdAt" DESC
    `
    return sequelize.query(query, { type: QueryTypes.SELECT, replacements })
  }
}
