
import { StatusOrderTypes } from '../../domain/entities/status_order_types.entity'
import { StatusTypesOrderTypesRepository } from '../../domain/repositories/status_order_types.repository'

/**
 * Use case responsible for creating a new store
 */
export class FindByIdStatusOrderTypeUseCase {
  constructor(
    private readonly statusTypeOrder: StatusTypesOrderTypesRepository
  ) { }

  
  async execute(id: string): Promise<StatusOrderTypes | null> {
    const orderStatusType = await this.statusTypeOrder.findById(id)
    return orderStatusType
  }
}
