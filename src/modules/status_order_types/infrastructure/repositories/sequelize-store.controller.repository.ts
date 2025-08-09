// infrastructure/repositories/sequelize-store.repository.ts

import { models } from '../../../../infrastructure/db/sequelize/orm/models'
import { StatusOrderTypes } from '../../domain/entities/status_order_types.entity'
import { CategoryOrderTypesRepository } from '../../domain/repositories/status_order_types.repository'

export class SequelizeStatusOrderTypesRepository implements CategoryOrderTypesRepository {
  async create(typeOrder: StatusOrderTypes): Promise<StatusOrderTypes | null> {
    try {
      const created = await models.StatusOrderTypes.create({
        ...typeOrder,
      })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findByName(name: string): Promise<StatusOrderTypes | null> {
    try {
      const scheduleStore = models.StatusOrderTypes.findOne({
        where: { name: String(name) },
      })
      return scheduleStore
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}