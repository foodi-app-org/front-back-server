import { PubSub } from 'graphql-subscriptions'
import { Transaction } from 'sequelize'

import { PubSubEventAdapter } from '../../../stock/adapters/PubSubEventAdapter'
import { StockServiceOptions } from '../../../stock/domain/types'
import { StockService } from '../../../stock/service'
import { getTenantName } from '../../../../shared/utils/tenant.utils'

import { ExtraStockRepository } from './extra-stock.repository'

export type ExtraStockServices = {
  decrement: (exPid: string, quantity: number, idStore: string, trx?: Transaction, opts?: Partial<StockServiceOptions>) => Promise<any>
  restock: (exPid: string, quantity: number, trx?: Transaction) => Promise<any>
  adjust: (exPid: string, newStock: number, trx?: Transaction) => Promise<any>
  registerInitialStock: (exPid: string, quantity: number, trx?: Transaction) => Promise<void>
  getStock: (exPid: string) => Promise<number | null>
}

/**
 * Tenant-scoped inventory services for product extras (complementos).
 *
 * Reuses the shared {@link StockService} business logic over the
 * `products_extras` table via {@link ExtraStockRepository}. This guarantees
 * extras follow the exact same reserve/decrement/restock rules and write to the
 * same `stock_history` kardex as real products, without duplicating logic.
 *
 * @param tenant - Raw tenant identifier (normalized with getTenantName).
 * @param pubsub - PubSub instance for stock events (optional).
 */
export const ExtraStockServicesTenantFactory = (tenant: string, pubsub?: PubSub): ExtraStockServices => {
  const repository = new ExtraStockRepository(getTenantName(tenant))
  const publisher = pubsub ? PubSubEventAdapter(pubsub) : undefined
  const stockService = new StockService({ repository, publisher })

  return {
    decrement: stockService.decrementStock,
    restock: stockService.restock,
    /**
     * Manual adjustment to an absolute target quantity. Applies a single stock
     * mutation and writes exactly ONE ADJUST row to the kardex (no double
     * counting), keeping stock, history and dashboard totals consistent.
     */
    adjust: async (exPid: string, newStock: number, trx?: Transaction) => {
      const row = await repository.findByIdForUpdate(exPid, trx)
      if (!row) throw new Error(`Product extra not found exPid=${exPid}`)
      const current = Number(row.stock ?? 0)
      const target = Number(newStock)
      const delta = target - current
      if (delta === 0) return { exPid, adjusted: 0, remaining: current }
      await repository.updateStock(exPid, target, current, trx)
      await repository.createStockHistory(
        { pId: exPid, delta, type: 'ADJUST', meta: { reason: 'manual-adjustment', target, previous: current } },
        trx
      )
      return { exPid, adjusted: delta, remaining: target }
    },
    /**
     * Records the initial IN movement for a newly created extra. The extra row
     * already persists `stock = quantity` at creation time, so this only writes
     * a single RESTOCK row to the kardex (no re-summing of the physical stock),
     * avoiding double counting.
     */
    registerInitialStock: async (exPid: string, quantity: number, trx?: Transaction) => {
      if (!exPid || quantity <= 0) return
      await repository.createStockHistory(
        { pId: exPid, delta: quantity, type: 'RESTOCK', meta: { reason: 'initial-stock' } },
        trx
      )
    },
    getStock: stockService.getStock
  }
}
