import { StockMovement } from '../../domain/entities/stock.entity'
import { IStockMovementRepository } from '../../domain/repositories/stock.repository'


/**
 * Role use cases with business logic orchestration.
 */
export class StockCreateUseCase {
  constructor(private readonly stockRepository: IStockMovementRepository) {}

  async execute(data: StockMovement): Promise<StockMovement | null> {
    return this.stockRepository.create(data) ?? null
  }
}
