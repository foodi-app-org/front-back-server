
import { QueryTypes, Transaction } from 'sequelize'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { StockMovement } from '../../domain/entities/stock.entity'
import { IStockMovementRepository, TopProductMovement } from '../../domain/repositories/stock.repository'
import { PRODUCT_MODEL } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product.model'
import { STOCK_HISTORY_MODEL } from '@modules/stock/infrastructure/db/sequelize/models/sequelize-stock-history.model'
import { ProductStockRow } from '@modules/stock/domain/types'
import { MigrationFolder } from '@shared/infrastructure/db/sequelize/migrations/umzug.config'

// Negative-delta DECREMENT rows in `stock_history` represent outgoing stock (sales).
const STOCK_HISTORY_DECREMENT = 'DECREMENT'

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

  findTopProductsMovements = async (limit = 10): Promise<TopProductMovement[]> => {
    const sequelize = models.Product.sequelize
    if (!sequelize) {
      throw new Error('Sequelize instance is not available')
    }

    // Sales consumption is recorded in `stock_history` as negative-delta
    // DECREMENT rows (the modular sales flow never writes to `stock_movements`),
    // so the ranking must read from `stock_history` to reflect real sales.
    const query = `
      SELECT
        p."pName" AS "productName",
        COALESCE(SUM(-h."delta"), 0) AS "totalMovements",
        p."pId" AS "idProduct"
      FROM "${this.tenant}.${PRODUCT_MODEL}" p
      INNER JOIN "${this.tenant}.${STOCK_HISTORY_MODEL}" h
        ON p."pId" = h."pId"
        AND h."type" = :decrementType
      GROUP BY p."pId", p."pName"
      HAVING SUM(-h."delta") > 0
      ORDER BY "totalMovements" DESC
      LIMIT :limit;
    `

    const rows = await sequelize.query<{ productName: string; totalMovements: number | string; idProduct: string | null }>(
      query,
      {
        type: QueryTypes.SELECT,
        replacements: { decrementType: STOCK_HISTORY_DECREMENT, limit }
      }
    )

    return rows.map((row) => ({
      productName: row.productName,
      totalMovements: Number(row.totalMovements ?? 0),
      idProduct: row.idProduct ?? null
    }))
  }
}