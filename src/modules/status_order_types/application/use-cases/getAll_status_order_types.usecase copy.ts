
import { StatusOrderTypesPagination } from '../../domain/entities/status_order_types.entity'
import { StatusTypesOrderTypesRepository } from '../../domain/repositories/status_order_types.repository'


/**
 * Use case responsible for get all GetAllStatusOrderType
 */
export class GetAllStatusOrderTypeUseCase {
  constructor(
    private readonly statusOrderTypesRepository: StatusTypesOrderTypesRepository,
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(idStore: string): Promise<StatusOrderTypesPagination | null> {
    const data = await this.statusOrderTypesRepository.getAll(idStore)
    return data
  }
}
