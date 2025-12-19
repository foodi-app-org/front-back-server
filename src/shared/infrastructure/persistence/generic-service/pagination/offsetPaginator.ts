import { FindOptions, ModelStatic, Op, WhereOptions } from 'sequelize'
import { PaginationResponse, PaginationMeta, OrderField } from './types'

/**
 * Offset paginator implementation
 * - Deterministic ordering ensured by adding primaryKey as tiebreaker
 */

/**
 * Build deterministic order array ensuring primary key is included.
 */
const buildOrder = (orderFields: OrderField[], primaryKey: string) =>
  [...orderFields, ...(orderFields.some(o => o.field === primaryKey) ? [] : [{ field: primaryKey, direction: orderFields[0]?.direction ?? 'DESC' }])].map(
    ({ field, direction }) => [field, direction] as [string, string]
  )

/**
 * Validate that pageSize and page are safe numbers.
 */
const normalizeOffsetParams = (page?: number, max?: number) => {
  const pageSize = Math.max(1, Math.floor(max ?? 300))
  const currentPage = Math.max(1, Math.floor(page ?? 1))
  const offset = (currentPage - 1) * pageSize
  return { pageSize, currentPage, offset }
}

/**
 * Fetch a page using offset pagination
 * @param modelSchema Sequelize model scoped to tenant (model.schema(tenant))
 * @param params params for query
 */
export const fetchOffsetPage = async <T>(
  modelSchema: ModelStatic<any>,
  {
    searchWhere,
    dateFilter,
    extraWhere,
    attributes,
    orderFields,
    page,
    max
  }: {
    searchWhere: WhereOptions
    dateFilter: WhereOptions
    extraWhere: WhereOptions
    attributes?: string[] | undefined
    orderFields: OrderField[]
    page?: number
    max?: number
  }
): Promise<PaginationResponse<T>> => {
  // Determine primary key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryKey: string = (modelSchema as any).primaryKeyAttribute ?? (modelSchema as any).primaryKeyAttributes?.[0] ?? 'id'

  const order = buildOrder(orderFields, primaryKey)

  const { pageSize, currentPage, offset } = normalizeOffsetParams(page, max)

  const where = {
    [Op.and]: [searchWhere, dateFilter, extraWhere]
  } as WhereOptions

  const totalRecords = await modelSchema.count({ where })

  const items = await modelSchema.findAll({
    ...(attributes && { attributes }),
    where,
    limit: pageSize,
    offset,
    order
  } as FindOptions)

  const meta: PaginationMeta = {
    totalRecords,
    totalPages: Math.max(0, Math.ceil(totalRecords / pageSize)),
    currentPage,
    pageSize,
    mode: 'offset'
  }

  return {
    success: true,
    message: 'Data fetched (offset)',
    data: items as T[],
    pagination: meta
  }
}
