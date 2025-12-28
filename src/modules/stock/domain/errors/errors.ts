// File: domain/errors.ts

import { StockErrorCodes } from "./helpers";

/**
 * Domain error classes for Stock module
 */
export class InsufficientStockError extends Error {
  public code = StockErrorCodes.INSUFFICIENT_STOCK
  public payload: { requested: number; available: number; pId: string }

  /**
   * @param pId Product id
   * @param requested Requested quantity
   * @param available Available quantity
   */
  constructor(pId: string, requested: number, available: number) {
    super(`Insufficient stock for pId=${pId}. requested=${requested}, available=${available}`)
    this.payload = { requested, available, pId }
    Object.setPrototypeOf(this, InsufficientStockError.prototype)
  }
}

export class StockValidationError extends Error {
  public code = StockErrorCodes.STOCK_VALIDATION_ERROR
  public payload?: unknown

  constructor(message: string, payload?: unknown) {
    super(message)
    this.payload = payload
    Object.setPrototypeOf(this, StockValidationError.prototype)
  }
}
