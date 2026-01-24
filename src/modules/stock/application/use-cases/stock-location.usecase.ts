import { IStockLocationRepository } from '@modules/stock/domain/repositories/stock_location.repository'
import { StockLocation } from '@modules/stock/domain/entities/stock-location.entity'

/**
 * Role use cases with business logic orchestration.
 */
export class StockLocationCreateUseCase {
  constructor(private readonly stockRepository: IStockLocationRepository) {}

  async execute(data: StockLocation): Promise<StockLocation | null> {
    return this.stockRepository.create(data) ?? null
  }
}
