
import { IStatusOrder, StatusOrder } from '../../domain/entities/status_order.entity'
import { StatusOrderRepository } from '../../domain/repositories/status_order.repository'

/**
 * Input DTO to create a new Store
 */
export type CreateStatusOrderDTO = IStatusOrder  

interface ResponseOrderStatusType {
  success: boolean
  message: string
  data: StatusOrder | null
}
/**
 * Use case responsible for creating a new store
 */
export class CreateStatusOrderTypeUseCase {
  constructor(
    private readonly statusOrderRepository: StatusOrderRepository,
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(input: CreateStatusOrderDTO): Promise<ResponseOrderStatusType | null> {
    
    // const statusOrderExist = await this.statusOrderRepository.findByName(input.name)

    // if (statusOrderExist) {
    //   return {
    //     success: false,
    //     message: 'Order status type with this name already exists',
    //     data: statusOrderExist
    //   }
    // }
    const newStatusOrder = new StatusOrder(input)
    const created = await this.statusOrderRepository.create(newStatusOrder)

    if (!created) {
      return {
        success: false,
        message: 'Failed to create order status type',
        data: null
      }
    }
    return {
      success: true,
      message: 'Order status type created successfully',
      data: created
    }
  }
}
