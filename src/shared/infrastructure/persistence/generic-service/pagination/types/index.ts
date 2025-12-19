/**
 * Shared pagination and typing utilities
 */

import { WhereOptions } from 'sequelize'

/**
 * Pagination options provided by callers
 */
export interface PaginationOptions {
  max?: number
  page?: number
  mode?: 'offset' | 'cursor'
  cursor?: string
}

/**
 * Ordering field definition
 */
export interface OrderField {
  field: string
  direction: 'ASC' | 'DESC'
}

/**
 * Common pagination metadata returned in responses
 */
export interface PaginationMeta {
  totalRecords: number
  totalPages: number
  currentPage: number
  pageSize: number
  mode: 'offset' | 'cursor'
}

/**
 * Standard pagination response
 */
export interface PaginationResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: PaginationMeta
}

/**
 * Cursor pagination response extends the common response with a nextCursor
 */
export interface CursorResponse<T> extends PaginationResponse<T> {
  nextCursor?: string | null
}

/**
 * GetAll params used by GenericService
 */
export interface GetAllParams {
  searchFields: string[]
  attributes?: string[] | null
  idStore: string
  pagination?: PaginationOptions
  where?: Record<string, unknown>
  orderFields?: OrderField[]
  // allow raw Sequelize where if needed
  rawWhere?: WhereOptions
}
