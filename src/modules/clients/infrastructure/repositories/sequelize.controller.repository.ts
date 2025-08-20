
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Clients } from '../../domain/entities/clients.entity'
import { ClientsRepository } from '../../domain/repositories/clients.repository'

export class SequelizeClientsRepository implements ClientsRepository {

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
}