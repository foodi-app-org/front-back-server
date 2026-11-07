import { StockMovement } from '../entities/stock.entity'
import { IProductRepository } from '../ports/IProductRepository'
import { ManagedUnitsInStockResult } from '../types'

/**
 * Ranking row describing how many units of a product left the inventory.
 */
export interface TopProductMovement {
  productName: string
  totalMovements: number
  idProduct: string | null
}

/**
 * Aggregated sales total for completed orders.
 */
export interface TotalSalesResult {
  success: boolean
  message: string
  totalSales: number | null
}

/**
 * Daily inventory movement summary (in/out/adjustment).
 */
export interface StockMovementSummary {
  date: string
  total_in: number
  total_out: number
  total_adjustment: number
}

/**
 * Week-over-week outgoing stock comparison.
 */
export interface WeeklyStockChange {
  weekStart: string | null
  totalOut: number | null
  prevTotalOut: number | null
  percentageChange: number | null
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
  /** Total monetary value of completed sales (state = CONCLUDED). */
  findTotalSales(): Promise<TotalSalesResult>
  /** Count of completed orders (state = CONCLUDED). */
  findTotalSalesSold(): Promise<number>
  /** Total units sold (sum of outgoing DECREMENT stock). */
  findTotalProductsSold(): Promise<number>
  /** Total managed units currently in stock. */
  findTotalProductsInStock(): Promise<number>
  /**
   * Paginated listing of managed units in stock (products + extras) with
   * `manageStock = true` and `stock > 0`. Pagination is applied in the
   * database over the combined set, so it scales regardless of catalog size.
   */
  findManagedUnitsInStock(params: { page: number; pageSize: number; search?: string | null }): Promise<ManagedUnitsInStockResult>
  /**
   * Daily aggregated IN/OUT/ADJUSTMENT movements, optionally restricted to a
   * half-open UTC range `[startAt, endAt)`.
   */
  findStockMovementsByDay(range?: { startAt?: string | null; endAt?: string | null }): Promise<StockMovementSummary[]>
  /** Week-over-week outgoing stock comparison. */
  findStockMovementWeeklyComparison(): Promise<WeeklyStockChange[]>
}
