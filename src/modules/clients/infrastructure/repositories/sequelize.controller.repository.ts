
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { Clients, ClientsPagination } from '../../domain/entities/clients.entity'
import { ClientsRepository } from '../../domain/repositories/clients.repository'
import { ClientsStateEnum, type SequelizeClientModel } from '../db/sequelize/models/sequelize-table.model'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

export class SequelizeClientsRepository implements ClientsRepository {
  private readonly genericService: GenericService<SequelizeClientModel>
  private readonly tenant: string

  constructor(tenant?: string) {
    this.genericService = new GenericService(models.Client.schema(tenant ?? MigrationFolder.Public)),
      this.tenant = tenant ?? MigrationFolder.Public
  }

  async create(data: Clients): Promise<Clients | null> {
    try {
      const created = await models.Client.schema(this.tenant).create({
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

  async findById(id: string): Promise<Clients | null> {
    try {
      const result = await models.Client.schema(this.tenant).findOne({
        where: {
          cliId: id,
          clState: ClientsStateEnum.ACTIVE
        },
        raw: true
      })
      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findByLegalId(legalId: string): Promise<Clients | null> {
    try {
      const result = await models.Client.schema(this.tenant).findOne({
        where: {
          ccClient: legalId,
          clState: ClientsStateEnum.ACTIVE
        },
        raw: true
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
