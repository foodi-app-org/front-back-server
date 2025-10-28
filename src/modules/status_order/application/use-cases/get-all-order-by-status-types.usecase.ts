
import { StatusOrder } from '../../domain/entities/status_order.entity'
import { StatusOrderRepository } from '../../domain/repositories/status_order.repository'

interface ResponseOrderStatusType {
    success: boolean
    message: string
    data: StatusOrder[] | null
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
     * @param pCodeRef - string code reference to search for
     * @returns An object indicating success, a message, and the found order status or null if not found
     */
    async execute(): Promise<ResponseOrderStatusType | null> {

        try {
            const order = await this.statusOrderRepository.getAllByStatusType()
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
