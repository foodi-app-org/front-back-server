import { FindOptions, ModelStatic, Op, WhereOptions } from 'sequelize'
import { CursorResponse, PaginationMeta, OrderField } from './types'

/**
 * Cursor (keyset) paginator implementation.
 *
 * Cursor is base64 encoded JSON: { <mainField>: string|number, id: string }
 */

/**
 * Build deterministic order array ensuring primary key is included.
 */
const buildOrder = (orderFields: OrderField[], primaryKey: string) =>
  [...orderFields, ...(orderFields.some(o => o.field === primaryKey) ? [] : [{ field: primaryKey, direction: orderFields[0]?.direction ?? 'DESC' }])].map(
    ({ field, direction }) => [field, direction] as [string, string]
  )

/**
 * Normalize pageSize and ensure positive.
 */
const normalizePageSize = (max?: number) => Math.max(1, Math.floor(max ?? 300))

/**
 * Encode cursor object to base64.
 */
const encodeCursor = (payload: Record<string, unknown>) => Buffer.from(JSON.stringify(payload)).toString('base64')

/**
 * Decode cursor.
 */
const decodeCursor = (cursor?: string) => {
  if (!cursor) return null
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Fetch using cursor pagination
 */
export const fetchCursorPage = async <T>(
  modelSchema: ModelStatic<any>,
  {
    searchWhere,
    dateFilter,
    extraWhere,
    attributes,
    orderFields,
    max,
    cursor
  }: {
    searchWhere: WhereOptions
    dateFilter: WhereOptions
    extraWhere: WhereOptions
    attributes?: string[] | undefined
    orderFields: OrderField[]
    max?: number
    cursor?: string
  }
): Promise<CursorResponse<T>> => {
  // Determine primary key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryKey: string = (modelSchema as any).primaryKeyAttribute ?? (modelSchema as any).primaryKeyAttributes?.[0] ?? 'id'

  const order = buildOrder(orderFields, primaryKey)

  const pageSize = normalizePageSize(max)

  // Ensure attributes include main ordering fields to create nextCursor
  // (caller should include createdAt / main field in attributes if using projection)
  // decode cursor
  const cursorObj = decodeCursor(cursor)

  // If cursor provided but invalid -> throw
  if (cursor && !cursorObj) throw new Error('Invalid cursor')

  const mainOrder = orderFields[0]
  const mainField = mainOrder.field
  const dir = mainOrder.direction // 'ASC' | 'DESC'
  const comparisonMain = dir === 'DESC' ? Op.lt : Op.gt
  const comparisonTie = dir === 'DESC' ? Op.lt : Op.gt

  // build cursorWhere only if cursorObj is present
  const cursorWhere: WhereOptions | {} = cursorObj
    ? {
        [Op.or]: [
          { [mainField]: { [comparisonMain]: (cursorObj as any)[mainField] } },
          {
            [Op.and]: [
              { [mainField]: (cursorObj as any)[mainField] },
              { [primaryKey]: { [comparisonTie]: (cursorObj as any).id } }
            ]
          }
        ]
      }
    : {}

  const finalWhere: WhereOptions = {
    [Op.and]: [searchWhere, dateFilter, extraWhere, cursorWhere]
  }

  const items = await modelSchema.findAll({
    ...(attributes && { attributes }),
    where: finalWhere,
    limit: pageSize,
    order
  } as FindOptions)

  let nextCursor: string | null = null
  if (items.length === pageSize) {
    const last = items[items.length - 1] as any
    const payload: Record<string, unknown> = {
      [mainField]: last[mainField],
      id: String(last[primaryKey])
    }
    nextCursor = encodeCursor(payload)
  }

  const meta: PaginationMeta = {
    totalRecords: 0, // keyset typically skips expensive count
    totalPages: 0,
    currentPage: 1,
    pageSize,
    mode: 'cursor'
  }

  return {
    success: true,
    message: 'Data fetched (cursor)',
    data: items as T[],
    pagination: meta,
    nextCursor
  }
}
