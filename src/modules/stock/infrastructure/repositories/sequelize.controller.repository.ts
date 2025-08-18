
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { StockMovement } from '../../domain/entities/stock.entity'
import { IStockMovementRepository } from '../../domain/repositories/roles.repository'

export class SequelizeStockRepository implements IStockMovementRepository {

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
}