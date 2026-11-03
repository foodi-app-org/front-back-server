/**
 * @file extra-stock-release.service.test.ts
 * @description Tests for the REUSABLE stock-release capability for product
 * extras (complementos), via the shared StockService.releaseReservation.
 *
 * Decision A1: there is NO end-to-end sale-cancellation flow in the system.
 * These tests validate only the inventory-service primitive used to return
 * extra units to stock (the building block a future reversal would call). They
 * are NOT tests of a sale-cancellation feature.
 *
 * Verified behaviours:
 *  - Releasing a managed extra adds the units back and writes a RELEASE kardex.
 *  - A non-managed extra (manageStock=false) is NOT altered (bypass, delta 0).
 *  - The extra identity (its id) is preserved on the kardex row.
 *  - Idempotency: the StockService has no built-in dedup key for releases, so
 *    idempotency must be enforced by the CALLER. We verify (a) the documented
 *    engine behaviour (a naive double-release double-adds) and (b) that a simple
 *    caller guard (release-once) keeps stock correct and writes a single RELEASE.
 */

import { Transaction } from 'sequelize'

import { IProductRepository } from '../../../stock/domain/ports/IProductRepository'
import { ProductStockRow } from '../../../stock/domain/types'
import { StockService } from '../../../stock/service'

type HistoryRow = { pId: string; delta: number; type: string; meta?: Record<string, unknown> }

/** In-memory repo over a single extra row, mirroring products_extras. */
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

describe('Product extra stock RELEASE capability (reusable, not sale cancellation)', () => {
  const EX_PID = 'extra-release-0001'

  const makeService = (initialStock: number, manageStock = true) => {
    const repo = new InMemoryExtraRepo({ pId: EX_PID, stock: initialStock, manageStock, previousStock: initialStock })
    const service = new StockService({ repository: repo })
    return { repo, service }
  }

  it('releases a managed extra: adds units back and records a RELEASE movement', async () => {
    const { repo, service } = makeService(7)
    // Simulate a prior sale of 3 (stock 7 -> 4), then release those 3.
    await service.decrementStock(EX_PID, 3, 'store-1') // -> 4
    const res = await service.releaseReservation(EX_PID, 3) // -> 7

    expect(res.released).toBe(3)
    expect(res.remaining).toBe(7)
    expect(repo.row.stock).toBe(7)
    const releases = repo.history.filter((h) => h.type === 'RELEASE')
    expect(releases).toHaveLength(1)
    expect(releases[0].delta).toBe(3)
    // Extra identity preserved on the kardex row.
    expect(releases[0].pId).toBe(EX_PID)
  })

  it('does NOT alter stock for a non-managed extra (manageStock=false, bypass)', async () => {
    const { repo, service } = makeService(0, false)
    const res = await service.releaseReservation(EX_PID, 4)

    expect(res.released).toBe(0)
    expect(repo.row.stock).toBe(0)
    // A bypassed RELEASE row (delta 0) is written; no real movement.
    const releases = repo.history.filter((h) => h.type === 'RELEASE')
    expect(releases).toHaveLength(1)
    expect(releases[0].delta).toBe(0)
    expect(releases[0].meta?.bypassed).toBe(true)
  })

  it('ENGINE behaviour: a naive double release double-adds (no built-in dedup)', async () => {
    const { repo, service } = makeService(4)
    await service.releaseReservation(EX_PID, 3) // 4 -> 7
    await service.releaseReservation(EX_PID, 3) // 7 -> 10 (engine has no idempotency key)

    expect(repo.row.stock).toBe(10)
    expect(repo.history.filter((h) => h.type === 'RELEASE')).toHaveLength(2)
  })

  it('caller-enforced idempotency: release-once guard keeps stock correct and writes a single RELEASE', async () => {
    const { repo, service } = makeService(4)
    const released = new Set<string>()
    const idempotencyKey = `${EX_PID}:sale-REF-1`

    const releaseOnce = async (qty: number) => {
      if (released.has(idempotencyKey)) return { skipped: true }
      await service.releaseReservation(EX_PID, qty)
      released.add(idempotencyKey)
      return { skipped: false }
    }

    const first = await releaseOnce(3) // applied -> 7
    const second = await releaseOnce(3) // skipped (idempotent)

    expect(first.skipped).toBe(false)
    expect(second.skipped).toBe(true)
    expect(repo.row.stock).toBe(7)
    expect(repo.history.filter((h) => h.type === 'RELEASE')).toHaveLength(1)
  })
})
