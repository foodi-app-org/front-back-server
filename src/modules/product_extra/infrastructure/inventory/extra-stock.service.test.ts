/**
 * @file extra-stock.service.test.ts
 * @description Behavioral unit tests for product-extra inventory handled via the
 * shared StockService (IN / OUT / ADJUSTMENT / reversal), using an in-memory
 * repository that mimics `products_extras` + `stock_history`. Verifies that
 * extras behave as real products and that there is no double counting.
 */

import { Transaction } from 'sequelize'

import { IProductRepository } from '../../../stock/domain/ports/IProductRepository'
import { ProductStockRow } from '../../../stock/domain/types'
import { StockService } from '../../../stock/service'

type HistoryRow = {
  pId: string
  delta: number
  type: string
  meta?: Record<string, unknown>
}

/**
 * In-memory IProductRepository over a single extra row. Records every stock
 * mutation and history entry so assertions can inspect the resulting kardex.
 */
class InMemoryExtraRepo implements IProductRepository {
  public row: ProductStockRow
  public history: HistoryRow[] = []

  constructor(initial: ProductStockRow) {
    this.row = initial
  }

  startTransaction = async (): Promise<Transaction> => ({} as Transaction)

  findByIdForUpdate = async (pId: string): Promise<ProductStockRow | null> =>
    pId === this.row.pId ? { ...this.row } : null

  updateStock = async (pId: string, newStock: number, previousStock: number): Promise<void> => {
    if (pId !== this.row.pId) return
    this.row = { ...this.row, stock: newStock, previousStock }
  }

  createStockHistory = async (payload: HistoryRow): Promise<void> => {
    this.history.push(payload)
  }

  getStock = async (pId: string): Promise<number | null> =>
    pId === this.row.pId ? Number(this.row.stock ?? 0) : null
}

describe('Product extra inventory (as a real product)', () => {
  const EX_PID = '11111111-1111-1111-1111-111111111111'

  const makeService = (initialStock: number, manageStock = true) => {
    const repo = new InMemoryExtraRepo({
      pId: EX_PID,
      stock: initialStock,
      manageStock,
      previousStock: initialStock
    })
    const service = new StockService({ repository: repo })
    return { repo, service }
  }

  it('OUT on sale: decrements extra stock and records a DECREMENT movement', async () => {
    const { repo, service } = makeService(10)

    const res = await service.decrementStock(EX_PID, 3, 'store-1')

    expect(res.remaining).toBe(7)
    expect(repo.row.stock).toBe(7)
    const dec = repo.history.filter((h) => h.type === 'DECREMENT')
    expect(dec).toHaveLength(1)
    expect(dec[0].delta).toBe(-3)
  })

  it('does NOT go negative and fails when stock is insufficient (no double discount)', async () => {
    const { repo, service } = makeService(2)

    await expect(service.decrementStock(EX_PID, 5, 'store-1')).rejects.toThrow()
    // Stock stays intact and no DECREMENT is written when it fails.
    expect(repo.row.stock).toBe(2)
    expect(repo.history.filter((h) => h.type === 'DECREMENT')).toHaveLength(0)
  })

  it('bypasses decrement when the extra does not manage stock', async () => {
    const { repo, service } = makeService(0, false)

    const res = await service.decrementStock(EX_PID, 4, 'store-1')

    expect(res.decremented).toBe(0)
    expect(repo.row.stock).toBe(0)
    // A bypassed history row is recorded with delta 0 (no real movement).
    expect(repo.history.every((h) => h.delta === 0)).toBe(true)
  })

  it('IN (restock): increases stock and records a RESTOCK movement', async () => {
    const { repo, service } = makeService(5)

    const res = await service.restock(EX_PID, 4)

    expect(res.remaining).toBe(9)
    expect(repo.row.stock).toBe(9)
    const restock = repo.history.filter((h) => h.type === 'RESTOCK')
    expect(restock).toHaveLength(1)
    expect(restock[0].delta).toBe(4)
  })

  it('reversal: releasing a sold quantity returns stock and records RELEASE', async () => {
    const { repo, service } = makeService(7)

    await service.decrementStock(EX_PID, 3, 'store-1') // sale -> 4
    const res = await service.releaseReservation(EX_PID, 3) // reversal -> 7

    expect(res.remaining).toBe(7)
    expect(repo.row.stock).toBe(7)
    expect(repo.history.filter((h) => h.type === 'RELEASE')).toHaveLength(1)
  })

  it('kardex integrity: net sum of deltas equals the net stock change (no duplication)', async () => {
    const { repo, service } = makeService(10)

    await service.decrementStock(EX_PID, 2, 'store-1') // -2
    await service.restock(EX_PID, 5) // +5
    await service.decrementStock(EX_PID, 1, 'store-1') // -1

    const netDelta = repo.history.reduce((acc, h) => acc + h.delta, 0)
    expect(netDelta).toBe(2) // 10 -> 12
    expect(repo.row.stock).toBe(12)
  })
})
