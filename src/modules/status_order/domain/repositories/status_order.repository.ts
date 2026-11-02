import { Transaction } from 'sequelize'

import { StatusOrder, StatusOrderPagination } from '../entities/status_order.entity'

export interface GetAllByStatusTypeFilters {
  search?: string
  min?: number
  max?: number
  fromDate?: string
  toDate?: string
  channel?: number
}

/**
 * Repository contract for StatusTypesOrderTypesRepository operations
 */
export interface StatusOrderRepository {
  create(data: StatusOrder, transaction?: Transaction): Promise<StatusOrder | null>
  findCodeRef(pCodeRef: string): Promise<StatusOrder | null>
  getAll(idStore: string): Promise<StatusOrderPagination | null>
  findById(id: string): Promise<StatusOrder | null>
  getAllByStatusType(filters?: GetAllByStatusTypeFilters): Promise<StatusOrder[] | null>
}
