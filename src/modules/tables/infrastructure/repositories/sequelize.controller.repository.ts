
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Table } from '../../domain/entities/tables.entity'
import { TableRepository } from '../../domain/repositories/shopping.repository'

export class SequelizeStatusOrderRepository implements TableRepository {

  async create(data: Table): Promise<Table | null> {
    try {
      const created = await models.Table.create({
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