import { StockMovement } from '../../domain/entities/stock.entity'
import { IStockMovementRepository } from '../../domain/repositories/roles.repository'


/**
 * Role use cases with business logic orchestration.
 */
export class RoleUseCase {
  constructor(private readonly stockRepository: IStockMovementRepository) {}

  async execute(data: StockMovement): Promise<StockMovement | null> {
    return this.stockRepository.create(data) ?? null
  }
}
