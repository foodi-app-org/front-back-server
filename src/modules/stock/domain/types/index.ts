// File: domain/types.ts
import { Transaction } from 'sequelize'

export enum StockEventType {
  RESERVE = 'RESERVE',
  DECREMENT = 'DECREMENT',
  RELEASE = 'RELEASE',
  RESTOCK = 'RESTOCK'
}

/**
 * Minimal product fields that Stock module uses
 */
export type ProductStockRow = {
  pId: string
  stock: number | null
  manageStock: boolean | null
  previousStock?: number | null
  ProQuantity?: number | null
  pCodeRef?: string | null
}

/**
 * Options passed to StockService methods
 */
export type StockServiceOptions = {
  allowNegativeStock?: boolean
  reservationTTL?: number // ms
  stockThresholdAlert?: number
  context?: { tenant?: string; userId?: string }
}

/**
 * Generic repository transaction param
 */
export type MaybeTransaction = Transaction | undefined
