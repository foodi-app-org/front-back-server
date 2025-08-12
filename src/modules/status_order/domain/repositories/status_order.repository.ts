import { StatusOrder, StatusOrderPagination } from '../entities/status_order.entity'

/**
 * Repository contract for StatusTypesOrderTypesRepository operations
 */
export interface StatusOrderRepository {
  create(data: StatusOrder): Promise<StatusOrder | null>
  findCodeRef(pCodeRef: string): Promise<StatusOrder | null>
  getAll(idStore: string): Promise<StatusOrderPagination | null>
  findById(id: string): Promise<StatusOrder | null>
}
