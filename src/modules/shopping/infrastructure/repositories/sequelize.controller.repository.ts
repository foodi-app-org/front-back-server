import { Transaction } from 'sequelize'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { ShoppingCart } from '../../domain/entities/shopping.entity'
import { ShoppingCartRepository } from '../../domain/repositories/shopping.repository'

export class SequelizeStatusOrderRepository implements ShoppingCartRepository {

  async create(data: ShoppingCart, transaction?: Transaction): Promise<ShoppingCart | null> {
    try {
      const created = await models.ShoppingCart.create({
        ...data,
      }, { transaction })
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
  async sumPrice(shoppingCartRefCode: string): Promise<number> {
    try {
      const result = await models.ShoppingCart.findOne({
        attributes: [
          [models.ShoppingCart.sequelize!.fn('SUM', models.ShoppingCart.sequelize!.col('priceProduct')), 'priceProduct']
        ],
        where: { shoppingCartRefCode },
        raw: true
      })

      if (!result) return 0
      const { priceProduct } = result
      return priceProduct ?? 0
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}