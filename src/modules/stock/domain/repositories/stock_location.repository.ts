import { StockLocation } from '../entities/stock-location.entity'
import { IProductRepository } from '../ports/IProductRepository'

/**
 * Repository interface (port) for Stock Locations.
 */
export interface IStockLocationRepository extends IProductRepository { 
  create(stockLocation: StockLocation): Promise<StockLocation | null>
}
