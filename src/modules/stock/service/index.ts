// File: service/StockService.ts
import { StockEventType, StockServiceOptions } from '../domain/types'
import { Transaction } from 'sequelize'
import { IProductRepository } from '../domain/ports/IProductRepository'
import { IEventPublisher } from '../domain/ports/IEventPublisher'
import { InsufficientStockError, StockValidationError } from '../domain/errors/errors'
import { SocketEvents } from '@shared/constants/socket-events'

/**
 * StockService use-cases (mini-hexagon application service).
 *
 * Public APIs:
 * - reserveStock
 * - decrementStock
 * - releaseReservation
 * - restock
 * - getStock
 *
 * All methods accept an optional transaction to allow the caller to orchestrate atomic flows.
 */
export class StockService {
  private readonly repo: IProductRepository
  private readonly publisher: IEventPublisher
  private readonly defaultConfig: Required<Pick<StockServiceOptions, 'allowNegativeStock' | 'reservationTTL' | 'stockThresholdAlert'>>

  constructor(opts: {
    repository: IProductRepository
    publisher?: IEventPublisher
    config?: Partial<StockServiceOptions>
  }) {
    this.repo = opts.repository
    this.publisher = opts.publisher ?? { publish: async () => undefined }
    this.defaultConfig = {
      allowNegativeStock: opts.config?.allowNegativeStock ?? false,
      reservationTTL: opts.config?.reservationTTL ?? 5 * 60 * 1000,
      stockThresholdAlert: opts.config?.stockThresholdAlert ?? 5
    }
  }

  /**
   * Reserve stock for a product (pessimistic locking).
   * Decrements stock by quantity (logical reservation).
   * Throws InsufficientStockError when not allowed and stock insufficient.
   *
   * @param pId product id
   * @param quantity amount to reserve
   * @param transaction optional sequelize transaction — recommended to pass from caller
   * @param options overrides
   */
  reserveStock = async (
    pId: string,
    quantity: number,
    transaction?: Transaction,
    _options?: Partial<StockServiceOptions>
  ): Promise<{ pId: string; reserved: number; remaining: number }> => {
    if (!pId) throw new StockValidationError('pId is required')
    if (!Number.isFinite(quantity) || quantity <= 0) throw new StockValidationError('quantity must be a positive number')

    const cfg = { ...this.defaultConfig, ...(_options ?? {}) }

    // Fetch row FOR UPDATE when transaction provided (pessimistic lock)
    const row = await this.repo.findByIdForUpdate(pId, transaction)
    if (!row) throw new StockValidationError(`Product not found pId=${pId}`)

    const manageStock = Boolean(row.manageStock ?? true)
    const currentStock = Number(row.stock ?? 0)
    if (!manageStock) {
      // Bypass decrement when stock is not managed
      await this.repo.createStockHistory({ pId, delta: 0, type: StockEventType.RESERVE, meta: { bypassed: true } }, transaction)
      return { pId, reserved: 0, remaining: currentStock }
    }

    const available = currentStock
    if (!cfg.allowNegativeStock && quantity > available) {
      throw new InsufficientStockError(pId, quantity, available)
    }

    const newStock = currentStock - quantity
    await this.repo.updateStock(pId, newStock, currentStock, transaction)
    await this.repo.createStockHistory({ pId, delta: -quantity, type: StockEventType.RESERVE, meta: { requested: quantity } }, transaction)

    // emit metric/event (non-blocking)
    await this.publisher.publish('stock.reserved', { pId, quantity, remaining: newStock })

    // threshold alert
    if (newStock <= cfg.stockThresholdAlert) {
      await this.publisher.publish('stock.threshold', { pId, remaining: newStock })
    }

    return { pId, reserved: quantity, remaining: newStock }
  }

  /**
   * Permanently decrement stock (on confirmed payment).
   */
  decrementStock = async (
    pId: string,
    quantity: number,
    idStore: string,
    transaction?: Transaction,
    _options: Partial<StockServiceOptions> = {}
  ): Promise<{ pId: string; decremented: number; remaining: number }> => {
    if (!pId) throw new StockValidationError('pId is required')
    if (!Number.isFinite(quantity) || quantity <= 0) throw new StockValidationError('quantity must be a positive number')

    const cfg = { ...this.defaultConfig, ..._options }

    const row = await this.repo.findByIdForUpdate(pId, transaction)
    if (!row) throw new StockValidationError(`Product not found pId=${pId}`)

    const manageStock = Boolean(row.manageStock ?? true)
    const currentStock = Number(row.stock ?? 0)
    if (!manageStock) {
      await this.repo.createStockHistory({ pId, delta: 0, type: StockEventType.DECREMENT, meta: { bypassed: true } }, transaction)
      return { pId, decremented: 0, remaining: currentStock }
    }

    if (!cfg.allowNegativeStock && quantity > currentStock) {
      throw new InsufficientStockError(pId, quantity, currentStock)
    }

    const newStock = currentStock - quantity
    await this.repo.updateStock(pId, newStock, currentStock, transaction)
    await this.repo.createStockHistory({ pId, delta: -quantity, type: StockEventType.DECREMENT, meta: { requested: quantity } }, transaction)
    await this.publisher.publish(SocketEvents.STOCK_UPDATED_BY_ID, { [SocketEvents.STOCK_UPDATED_BY_ID]: { pId, newStock: newStock, idStore } })
    await this.publisher.publish(SocketEvents.ALL_STOCK_UPDATED, { [SocketEvents.ALL_STOCK_UPDATED]: { pId, newStock: newStock, idStore } })


    if (newStock <= cfg.stockThresholdAlert) {
      // await this.publisher.publish('stock.threshold', { pId, remaining: newStock })
      await this.publisher.publish(SocketEvents.STOCK_UPDATED_BY_ID, {
        [SocketEvents.STOCK_UPDATED_BY_ID]:
        {
          pId,
          newStock: newStock,
          event: 'THRESHOLD_ALERT',
          meta: {
            alertThreshold: cfg.stockThresholdAlert
          }
        }
      })
      await this.publisher.publish(SocketEvents.ALL_STOCK_UPDATED, {
        [SocketEvents.ALL_STOCK_UPDATED]:
        {
          pId,
          newStock: newStock,
          event: 'THRESHOLD_ALERT',
          meta: {
            alertThreshold: cfg.stockThresholdAlert
          }
        }
      })
    }

    return { pId, decremented: quantity, remaining: newStock }
  }

  /**
   * Release a previously reserved quantity (adds back to stock).
   */
  releaseReservation = async (
    pId: string,
    quantity: number,
    transaction?: Transaction,
    _options?: Partial<StockServiceOptions>
  ): Promise<{ pId: string; released: number; remaining: number }> => {
    if (!pId) throw new StockValidationError('pId is required')
    if (!Number.isFinite(quantity) || quantity <= 0) throw new StockValidationError('quantity must be a positive number')

    const row = await this.repo.findByIdForUpdate(pId, transaction)
    if (!row) throw new StockValidationError(`Product not found pId=${pId}`)

    const manageStock = Boolean(row.manageStock ?? true)
    const currentStock = Number(row.stock ?? 0)
    if (!manageStock) {
      await this.repo.createStockHistory({ pId, delta: 0, type: StockEventType.RELEASE, meta: { bypassed: true } }, transaction)
      return { pId, released: 0, remaining: currentStock }
    }

    const newStock = currentStock + quantity
    await this.repo.updateStock(pId, newStock, currentStock, transaction)
    await this.repo.createStockHistory({ pId, delta: quantity, type: StockEventType.RELEASE, meta: { releasedBy: 'releaseReservation' } }, transaction)
    await this.publisher.publish('stock.released', { pId, quantity, remaining: newStock })
    return { pId, released: quantity, remaining: newStock }
  }

  /**
   * Manual restock (admin)
   */
  restock = async (
    pId: string,
    quantity: number,
    transaction?: Transaction,
  ): Promise<{ pId: string; restocked: number; remaining: number }> => {
    if (!pId) throw new StockValidationError('pId is required')
    if (!Number.isFinite(quantity) || quantity <= 0) throw new StockValidationError('quantity must be a positive number')

    const row = await this.repo.findByIdForUpdate(pId, transaction)
    if (!row) throw new StockValidationError(`Product not found pId=${pId}`)

    const currentStock = Number(row.stock ?? 0)
    const newStock = currentStock + quantity
    await this.repo.updateStock(pId, newStock, currentStock, transaction)
    await this.repo.createStockHistory({ pId, delta: quantity, type: StockEventType.RESTOCK, meta: { by: 'manual' } }, transaction)
    await this.publisher.publish('stock.restock', { pId, quantity, remaining: newStock })
    return { pId, restocked: quantity, remaining: newStock }
  }

  /**
   * Read-only get stock
   */
  getStock = async (pId: string): Promise<number | null> => {
    if (!pId) throw new StockValidationError('pId is required')
    return await this.repo.getStock(pId)
  }
}
