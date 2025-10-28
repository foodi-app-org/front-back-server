
import { StatusOrderTypes } from '../../domain/entities/status_order_types.entity'
import { StatusTypesOrderTypesRepository } from '../../domain/repositories/status_order_types.repository'

/**
 * Use case responsible for creating a new store
 */
export class FindByNameStatusOrderTypeUseCase {
  constructor(
    private readonly categoryStatusOrderRepository: StatusTypesOrderTypesRepository
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(name: string): Promise<StatusOrderTypes | null> {
    const orderStatusType = await this.categoryStatusOrderRepository.findByName(name)
    return orderStatusType
  }
}
