import { StockMovement } from '../entities/stock.entity'
import { IProductRepository } from '../ports/IProductRepository'

/**
 * Ranking row describing how many units of a product left the inventory.
 */
export interface TopProductMovement {
  productName: string
  totalMovements: number
  idProduct: string | null
}

/**
 * Repository interface (port) for Stock Movements.
 */
export interface IStockMovementRepository extends IProductRepository { 
  create(stockMovement: StockMovement): Promise<StockMovement | null>
  /**
   * Returns the best-selling products ranked by outgoing (DECREMENT) stock.
   * @param limit maximum number of products to return
   */
  findTopProductsMovements(limit?: number): Promise<TopProductMovement[]>
}
