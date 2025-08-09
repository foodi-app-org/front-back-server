import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { StatusOrderTypes, StatusOrderTypesPagination } from '../../domain/entities/status_order_types.entity'
import { StatusTypesOrderTypesRepository } from '../../domain/repositories/status_order_types.repository'
import type { SequelizeStatusOrderTypesModel } from '../db/sequelize/models/sequelize-status_orders_types.model'

export class SequelizeStatusOrderTypesRepository implements StatusTypesOrderTypesRepository {
  private readonly genericService: GenericService<SequelizeStatusOrderTypesModel>

  constructor() {
    this.genericService = new GenericService(models.StatusOrderTypes)
  }

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

  async getAll(idStore: string): Promise<StatusOrderTypesPagination | null> {
    try {
      const result = await this.genericService.getAll({
        searchFields: ['name', 'description'],
        idStore
      })

      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}