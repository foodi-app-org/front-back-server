import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { StatusOrderTypes } from '../../domain/entities/status_order_types.entity'
import { StatusTypesOrderTypesRepository } from '../../domain/repositories/status_order_types.repository'

export class SequelizeStatusOrderTypesRepository implements StatusTypesOrderTypesRepository {
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

  async getAll(): Promise<StatusOrderTypes[] | null> {
    try {
      const items = await models.StatusOrderTypes.findAll()
      return items
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}