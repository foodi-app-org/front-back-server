
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Table } from '../../domain/entities/tables.entity'
import { TableRepository } from '../../domain/repositories/shopping.repository'
import { SequelizeTableModel } from '../db/sequelize/models/sequelize-table.model'

export class SequelizeTableRepository implements TableRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  /**
   * Maps a persistence model into the domain entity.
   * @param model - Sequelize table model instance.
   * @returns The domain Table entity.
   */
  private toDomain(model: SequelizeTableModel): Table {
    return new Table(
      model.tableId,
      model.tableName,
      model.seats,
      model.section,
      model.tableState,
      model.createdAt,
      model.updatedAt
    )
  }

  async create(data: Table): Promise<Table | null> {
    try {
      const created = await models.Table.schema(this.tenant).create({
        tableName: data.tableName,
        seats: data.seats,
        section: data.section,
        tableState: data.tableState,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return this.toDomain(created)
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
      return tables.map((table) => { return this.toDomain(table) })
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}
