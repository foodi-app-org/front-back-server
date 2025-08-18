import { StockMovement } from '../entities/stock.entity'

/**
 * Repository interface (port) for Stock Movements.
 */
export interface IStockMovementRepository {
  create(stockMovement: StockMovement): Promise<StockMovement | null>
}
