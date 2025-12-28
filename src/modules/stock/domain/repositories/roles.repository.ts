import { StockMovement } from '../entities/stock.entity'
import { IProductRepository } from '../ports/IProductRepository'

/**
 * Repository interface (port) for Stock Movements.
 */
export interface IStockMovementRepository extends IProductRepository { 
  create(stockMovement: StockMovement): Promise<StockMovement | null>
}
