
import { StatusOrder } from '../../domain/entities/status_order.entity'
import { StatusOrderRepository } from '../../domain/repositories/status_order.repository'

interface ResponseOrderStatusType {
    success: boolean
    message: string
    data: StatusOrder[] | null
}

export interface GetAllSalesStoreFilters {
    search?: string
    min?: number
    max?: number
    fromDate?: string
    toDate?: string
    channel?: number
}
/**
 * Use case responsible for creating a new store
 */
export class GetAllByStatusTypeUseCase {
    constructor(
        private readonly statusOrderRepository: StatusOrderRepository
    ) { }

    /**
     * Executes the use case to fetch an order status by code reference
     * @param filters - optional filters to narrow down the sales results
     * @returns An object indicating success, a message, and the found order status or null if not found
     */
    async execute(filters?: GetAllSalesStoreFilters): Promise<ResponseOrderStatusType | null> {

        try {
            const order = await this.statusOrderRepository.getAllByStatusType(filters)
            if (!order) {
                return {
                    success: false,
                    message: 'Order status not found',
                    data: null
                }
            }
            return {
                success: true,
                message: 'Order status found successfully',
                data: order
            }

        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : String(error),
                data: null
            }
        }

    }
}
