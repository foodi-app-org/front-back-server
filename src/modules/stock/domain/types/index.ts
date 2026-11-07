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
 * Discriminador del origen de una unidad en inventario: producto principal o
 * complemento (extra). Permite a la UI distinguir ambos en una tabla única.
 */
export type ManagedUnitKind = 'PRODUCT' | 'EXTRA'

/**
 * Fila normalizada de "unidades en inventario": unifica productos
 * (`product_models`) y complementos (`products_extras`) manejados por
 * inventario y con existencias, en una forma común lista para la tabla.
 */
export type ManagedUnitRow = {
  id: string
  kind: ManagedUnitKind
  name: string
  stock: number
  price: number
  active: boolean
}

/** Metadata de paginación (mismo contrato que `productFoodsAll.pagination`). */
export type ManagedUnitsPaginationMeta = {
  totalRecords: number
  totalPages: number
  currentPage: number
}

/** Respuesta paginada del listado de unidades gestionadas en inventario. */
export type ManagedUnitsInStockResult = {
  success: boolean
  message: string
  data: ManagedUnitRow[]
  pagination: ManagedUnitsPaginationMeta
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
