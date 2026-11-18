import { QueryTypes } from 'sequelize'

import connect from '../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import {
  type GetOrderBoardHistoryQuery,
  type OrderBoardHistoryItem,
  type OrderBoardHistoryPage,
  type OrderBoardHistoryRepository,
  OrderBoardHistoryError
} from '../../domain/repositories/order-board-history.repository'

type HistoryRow = Omit<OrderBoardHistoryItem, 'createdAt'> & {
  createdAt: string | Date
}

const normalizeDate = (value: Date | string): string => {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString()
}

/** The schema comes exclusively from the authenticated store factory. */
export class SequelizeOrderBoardHistoryRepository implements OrderBoardHistoryRepository {
  constructor(private readonly tenantSchema: string) {}

  async getByOrder(query: GetOrderBoardHistoryQuery): Promise<OrderBoardHistoryPage> {
    const db = connect()

    // Authorization scope: both the tenant schema and order.idStore must match.
    // A nonexistent order is NOT an empty history.
    const sale = await models.StatusOrder.schema(this.tenantSchema).findOne({
      where: { pCodeRef: query.pCodeRef, idStore: query.storeId },
      attributes: ['stPId'],
      raw: true
    })
    if (!sale?.stPId) {
      throw new OrderBoardHistoryError('NOT_FOUND', 'No se encontró esta orden en tu comercio.')
    }

    const qi = db.getQueryInterface()
    // @ts-ignore
    const table = (name: string) => qi.queryGenerator.quoteTable({
      schema: this.tenantSchema,
      tableName: name
    })

    const history = table('order_board_status_history')
    const statusTypes = table('order_status_types')
    const users = table('users')
    const replacements = {
      storeId: query.storeId,
      stPId: sale.stPId,
      pCodeRef: query.pCodeRef,
      pageSize: query.pageSize,
      offset: (query.page - 1) * query.pageSize
    }

    // Read-only, tenant-isolated SQL; no interpolation of client-supplied values.
    // LEFT JOIN keeps old audit rows even if a status or user was removed.
    const selectSql = `
      SELECT
        h."id", h."idStore", h."stPId", h."pCodeRef",
        h."fromStatusId", h."toStatusId", h."movedBy", h."createdAt",
        origin."name" AS "fromStatusName",
        destination."name" AS "toStatusName",
        COALESCE(
          NULLIF(TRIM(COALESCE(u."name", '') || ' ' || COALESCE(u."lastName", '')), ''),
          NULLIF(u."username", '')
        ) AS "movedByName"
      FROM ${history} h
      LEFT JOIN ${statusTypes} origin ON origin."idStatus" = h."fromStatusId"
      LEFT JOIN ${statusTypes} destination ON destination."idStatus" = h."toStatusId"
      LEFT JOIN ${users} u ON u."id" = h."movedBy" AND u."idStore" = h."idStore"
      WHERE h."idStore" = :storeId
        AND h."stPId" = :stPId
        AND h."pCodeRef" = :pCodeRef
      ORDER BY h."createdAt" DESC, h."id" DESC
      LIMIT :pageSize OFFSET :offset
    `
    const countSql = `
      SELECT COUNT(*) AS "totalRecords"
      FROM ${history} h
      WHERE h."idStore" = :storeId
        AND h."stPId" = :stPId
        AND h."pCodeRef" = :pCodeRef
    `

    try {
      const [rows, counts] = await Promise.all([
        db.query<HistoryRow>(selectSql, { type: QueryTypes.SELECT, replacements }),
        db.query<{ totalRecords: number | string }>(countSql, { type: QueryTypes.SELECT, replacements })
      ])
      const totalRecords = Number(counts[0]?.totalRecords ?? 0)
      const items: OrderBoardHistoryItem[] = rows.map(row => ({
        ...row,
        createdAt: normalizeDate(row.createdAt)
      }))

      return {
        pCodeRef: query.pCodeRef,
        items,
        totalRecords,
        totalPages: Math.ceil(totalRecords / query.pageSize),
        currentPage: query.page,
        pageSize: query.pageSize,
        hasMore: query.page * query.pageSize < totalRecords
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (/no such table|does not exist|no description found/i.test(message)) {
        throw new OrderBoardHistoryError(
          'HISTORY_NOT_AVAILABLE',
          'El historial de órdenes no está disponible para este comercio. Verifica las migraciones.'
        )
      }
      throw error
    }
  }
}
