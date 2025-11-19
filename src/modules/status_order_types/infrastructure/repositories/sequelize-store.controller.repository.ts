import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { StatusOrderTypes, StatusOrderTypesPagination } from '../../domain/entities/status_order_types.entity'
import { StatusTypesOrderTypesRepository } from '../../domain/repositories/status_order_types.repository'
import type { SequelizeStatusOrderTypesModel } from '../db/sequelize/models/sequelize-status_orders_types.model'

export class SequelizeStatusOrderTypesRepository implements StatusTypesOrderTypesRepository {
  private readonly genericService: GenericService<SequelizeStatusOrderTypesModel>
  private readonly tenant: string

  constructor(tenant: string = MigrationFolder.Public) {
    this.genericService = new GenericService(models.StatusOrderTypes)
    this.tenant = tenant
  }

  async create(typeOrder: StatusOrderTypes): Promise<StatusOrderTypes | null> {
    try {
      const created = await models.StatusOrderTypes.schema(this.tenant).create({
        ...typeOrder
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
      const scheduleStore = await models.StatusOrderTypes
        .schema(this.tenant)
        .findOne({
          where: { name: String(name) },
          raw: true,
        })

      return scheduleStore
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new Error(String(e));
    }
  }

  async getAll(idStore: string): Promise<StatusOrderTypesPagination | null> {
    try {
      const result = await this.genericService.getAll({
        searchFields: ['name', 'description'],
        idStore,
        orderFields: [{ field: 'createdAt', direction: 'ASC' }]
      })

      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findById(id: string): Promise<StatusOrderTypes | null> {
    try {
      const data = await models.StatusOrderTypes
        .schema(this.tenant)
        .findOne({
          where: { idStatus: String(id) },
          raw: true,
        })
      return data
    }
    catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}