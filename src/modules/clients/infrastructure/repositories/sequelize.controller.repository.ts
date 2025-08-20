
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { Clients, ClientsPagination } from '../../domain/entities/clients.entity'
import { ClientsRepository } from '../../domain/repositories/clients.repository'
import type { SequelizeClientModel } from '../db/sequelize/models/sequelize-table.model'

export class SequelizeClientsRepository implements ClientsRepository {
  private readonly genericService: GenericService<SequelizeClientModel>

  constructor() {
    this.genericService = new GenericService(models.Client)
  }
  async create(data: Clients): Promise<Clients | null> {
    try {
      const created = await models.Client.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async getAll(idStore: string): Promise<ClientsPagination | null> {
    try {
      const result = await this.genericService.getAll({
        searchFields: ['pCodeRef'],
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
