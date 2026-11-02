import { Transaction } from 'sequelize'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { IProductRepository } from '../../../stock/domain/ports/IProductRepository'
import { ProductStockRow } from '../../../stock/domain/types'

/**
 * Stock repository adapter for product extras (complementos).
 *
 * Implements the same {@link IProductRepository} port used by the shared
 * StockService, but operates over the `products_extras` table instead of
 * `product_models`. This lets extras reuse the exact same inventory business
 * logic (reserve / decrement / release / restock) and the same `stock_history`
 * kardex as real products, with no duplicated logic.
 *
 * The `pId` argument of the port maps to the extra's `exPid`. Every history
 * row is tagged in `meta` with `{ kind: 'EXTRA', exPid, parentPId }` so the
 * dashboard and audits can distinguish and trace extra movements back to their
 * parent product.
 */
export class ExtraStockRepository implements IProductRepository {
  private readonly tenant: string
  // Caches the parent product id per extra so createStockHistory can enrich
  // the meta for auditing without changing the shared StockService contract.
  private readonly parentByExPid = new Map<string, string | null>()

  constructor(tenant: string) {
    this.tenant = tenant
  }

  startTransaction = async (): Promise<Transaction> => {
    if (!models.ProductExtra.sequelize) {
      throw new Error('Sequelize instance is not available')
    }
    return await models.ProductExtra.sequelize.transaction()
  }

  findByIdForUpdate = async (exPid: string, transaction?: Transaction): Promise<ProductStockRow | null> => {
    const options: any = {
      where: { exPid },
      attributes: ['exPid', 'pId', 'stock', 'manageStock', 'previousStock'],
      transaction
    }
    if (transaction) options.lock = transaction.LOCK.UPDATE
    const row = await models.ProductExtra.schema(this.tenant).findOne(options)
    if (!row) return null
    const plain = row.get({ plain: true }) as any
    this.parentByExPid.set(exPid, plain.pId ?? null)
    return {
      pId: plain.exPid,
      stock: plain.stock,
      manageStock: plain.manageStock,
      previousStock: plain.previousStock
    }
  }

  updateStock = async (exPid: string, newStock: number, previousStock: number, transaction?: Transaction): Promise<void> => {
    await models.ProductExtra.schema(this.tenant).update(
      { stock: newStock, previousStock },
      { where: { exPid }, transaction }
    )
  }

  createStockHistory = async (
    payload: { pId: string; delta: number; type: 'RESERVE' | 'RELEASE' | 'DECREMENT' | 'RESTOCK' | 'ADJUST'; meta?: Record<string, unknown> },
    transaction?: Transaction
  ): Promise<void> => {
    const exPid = payload.pId
    const parentPId = this.parentByExPid.get(exPid) ?? null
    const historyData = {
      id: undefined,
      pId: exPid,
      delta: payload.delta,
      type: payload.type,
      meta: JSON.stringify({ ...(payload.meta ?? {}), kind: 'EXTRA', exPid, parentPId }),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await models.StockHistory.schema(this.tenant).create(historyData, { transaction })
  }

  getStock = async (exPid: string): Promise<number | null> => {
    const row = await models.ProductExtra.schema(this.tenant).findOne({
      where: { exPid },
      attributes: ['stock']
    })
    if (!row) return null
    return Number(row.get('stock'))
  }
}
