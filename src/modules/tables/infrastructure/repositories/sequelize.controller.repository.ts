
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Table } from '../../domain/entities/tables.entity'
import { TableRepository } from '../../domain/repositories/shopping.repository'

export class SequelizeTableRepository implements TableRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }
  async create(data: Table): Promise<Table | null> {
    try {
      const created = await models.Table.schema(this.tenant).create({
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
  async getAll(): Promise<Table[]> {
    try {
      const tables = await models.Table.schema(this.tenant).findAll()
      return tables
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}