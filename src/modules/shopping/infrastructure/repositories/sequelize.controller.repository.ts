import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { ShoppingCart } from '../../domain/entities/shopping.entity'
import { ShoppingCartRepository } from '../../domain/repositories/shopping.repository'

export class SequelizeStatusOrderRepository implements ShoppingCartRepository {

  async create(data: ShoppingCart): Promise<ShoppingCart | null> {
    try {
      const created = await models.ShoppingCart.create({
        ...data,
      })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findCodeRef(pCodeRef: string): Promise<ShoppingCart | null> {
    try {
      const scheduleStore = models.ShoppingCart.findOne({
        where: { shoppingCartRefCode: String(pCodeRef) },
      })
      return scheduleStore
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findById(id: string): Promise<ShoppingCart | null> {
    try {
      const statusOrder = await models.ShoppingCart.findOne({ where: { shoppingCartId: id } })
      if (!statusOrder) {
        return null
      }
      return statusOrder
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}