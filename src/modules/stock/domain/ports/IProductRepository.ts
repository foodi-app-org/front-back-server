// File: ports/IProductRepository.ts
import { Transaction } from 'sequelize'
import { ProductStockRow } from '../types'

/**
 * Port: repository interface for product stock operations
 */
export interface IProductRepository {
  /**
   * Start a transaction (optional).
   */
  startTransaction: () => Promise<Transaction>

  /**
   * Find product row by pId with FOR UPDATE lock if transaction provided.
   * Should return null if not found.
   * @param pId product id
   * @param transaction optional transaction
   */
  findByIdForUpdate: (pId: string, transaction?: Transaction) => Promise<ProductStockRow | null>

  /**
   * Atomically update stock and previousStock fields on product
   */
  updateStock: (
    pId: string,
    newStock: number,
    previousStock: number,
    transaction?: Transaction
  ) => Promise<void>

  /**
   * Create a stock history row
   */
  createStockHistory: (
    payload: {
      pId: string
      delta: number
      type: 'RESERVE' | 'RELEASE' | 'DECREMENT' | 'RESTOCK' | 'ADJUST'
      meta?: Record<string, unknown>
    },
    transaction?: Transaction
  ) => Promise<void>

  /**
   * Get current stock without locks
   */
  getStock: (pId: string) => Promise<number | null>
}
