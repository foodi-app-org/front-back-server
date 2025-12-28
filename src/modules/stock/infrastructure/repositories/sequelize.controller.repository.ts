
import { Transaction } from 'sequelize'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { StockMovement } from '../../domain/entities/stock.entity'
import { IStockMovementRepository } from '../../domain/repositories/roles.repository'
import { ProductStockRow } from '@modules/stock/domain/types'
import { MigrationFolder } from '@shared/infrastructure/db/sequelize/migrations/umzug.config'

export class SequelizeStockRepository implements IStockMovementRepository {
  private readonly tenant: string

  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async create(data: Omit<StockMovement, 'createdAt' | 'updatedAt'>): Promise<StockMovement | null> {
    try {
      const created = await models.StockMovement.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return created as StockMovement
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  startTransaction = async (): Promise<Transaction> => {
    // models.Product.sequelize should exist
    if (!models.Product.sequelize) {
      throw new Error('Sequelize instance is not available')
    }
    return await models.Product.sequelize.transaction()
  }

  findByIdForUpdate = async (pId: string, transaction?: Transaction): Promise<ProductStockRow | null> => {
    const options: any = {
      where: { pId },
      attributes: ['pId', 'stock', 'manageStock', 'previousStock', 'ProQuantity'],
      transaction
    }
    if (transaction) options.lock = transaction.LOCK.UPDATE
    const row = await models.Product.schema(this.tenant).findOne(options)
    if (!row) return null
    return row.get({ plain: true }) as ProductStockRow
  }

  updateStock = async (pId: string, newStock: number, previousStock: number, transaction?: Transaction): Promise<void> => {
    const updateOptions: any = { where: { pId }, transaction }
    await models.Product.schema(this.tenant).update({ stock: newStock, previousStock }, updateOptions)
  }

  createStockHistory = async (
    payload: { pId: string; delta: number; type: 'RESERVE' | 'RELEASE' | 'DECREMENT' | 'RESTOCK' | 'ADJUST'; meta?: Record<string, unknown> },
    transaction?: Transaction
  ): Promise<void> => {
    const historyData = {
      id: undefined,
      pId: payload.pId,
      delta: payload.delta,
      type: payload.type,
      meta: JSON.stringify(payload.meta ?? {}),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await models.StockHistory.schema(this.tenant).create(historyData, { transaction })
  }

  getStock = async (pId: string): Promise<number | null> => {
    const row = await models.Product.schema(this.tenant).findOne({
      where: { pId },
      attributes: ['stock']
    })
    if (!row) return null
    return Number(row.get('stock'))
  }
}