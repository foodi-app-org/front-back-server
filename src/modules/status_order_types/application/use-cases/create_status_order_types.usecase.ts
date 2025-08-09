
import { StateOderTypes, StatusOrderTypes } from '../../domain/entities/status_order_types.entity'
import { CategoryOrderTypesRepository } from '../../domain/repositories/status_order_types.repository'

/**
 * Input DTO to create a new Store
 */
export interface CreateStatusTypeOrderDTO {
  idStatus: string
  name: string
  description: string
  color: string
  backgroundColor: string
  state: StateOderTypes
  active: boolean
  priority: number
  createdAt: Date
  updatedAt: Date
}

interface ResponseOrderStatusType {
  success: boolean
  message: string
  data: StatusOrderTypes | null
}
/**
 * Use case responsible for creating a new store
 */
export class CreateStatusOrderTypeUseCase {
  constructor(
    private readonly categoryStatusOrderRepository: CategoryOrderTypesRepository,
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(input: CreateStatusTypeOrderDTO): Promise<ResponseOrderStatusType | null> {
    
    const statusOrderExist = await this.categoryStatusOrderRepository.findByName(input.name)

    if (statusOrderExist) {
      return {
        success: false,
        message: 'Order status type with this name already exists',
        data: statusOrderExist
      }
    }
    const newStatusOrderTypes = new StatusOrderTypes(input)
    const created = await this.categoryStatusOrderRepository.create(newStatusOrderTypes)

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
