import { StatusOrder } from '../../domain/entities/status_order.entity'
import { StatusOrderRepository } from '../../domain/repositories/status_order.repository'

interface ResponseOrderStatusType {
  success: boolean
  message: string
  data: StatusOrder[] | null
}

export interface GetAllSalesStoreFilters {
  /** Commerce verified from the current GraphQL session (never client-provided). */
  idStore?: string
  search?: string
  min?: number
  max?: number
  fromDate?: string
  toDate?: string
  channel?: number
}

export class GetAllByStatusTypeUseCase {
  constructor(private readonly statusOrderRepository: StatusOrderRepository) {}

  async execute(filters?: GetAllSalesStoreFilters): Promise<ResponseOrderStatusType | null> {
    try {
      const order = await this.statusOrderRepository.getAllByStatusType(filters)
      if (!order) return { success: false, message: 'Order status not found', data: null }
      return { success: true, message: 'Order status found successfully', data: order }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        data: null
      }
    }
  }
}
