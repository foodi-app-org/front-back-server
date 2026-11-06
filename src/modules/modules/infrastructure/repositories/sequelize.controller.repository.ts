import { Transaction } from 'sequelize'

import connect from '../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Module } from '../../domain/entities/modules.entity'
import { ModuleOrderItem, ModuleRepository } from '../../domain/repositories/module.repository'

export class SequelizeModuleOrderRepository implements ModuleRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async create(data: Module, transaction?: Transaction): Promise<Module | null> {
    try {
      const created = await models.Module.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { transaction })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async getAll(): Promise<Module[]> {
    try {
      // Order by the user-defined priority so a saved reorder survives reloads.
      // Without an explicit ORDER BY, Postgres returns rows in an undefined
      // (insertion-like) order and the custom ordering appears to be lost.
      // `mName` is a stable tie-breaker for modules sharing the same priority.
      const modules = await models.Module.schema(this.tenant).findAll({
        order: [
          ['mPriority', 'ASC'],
          ['mName', 'ASC']
        ]
      })
      return modules
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  /**
   * Applies a new ordering to the given modules atomically.
   *
   * All updates run inside a single transaction and target the same schema the
   * reads use (`this.tenant`), keeping writes and `getAll()` consistent. If any
   * row fails, the transaction is rolled back and nothing is persisted.
   */
  async updateOrder(items: ModuleOrderItem[]): Promise<Module[]> {
    const sequelize = connect()

    try {
      const updatedIds = await sequelize.transaction(async (transaction: Transaction) => {
        for (const { mId, mPriority } of items) {
          await models.Module.schema(this.tenant).update(
            { mPriority },
            { where: { mId }, transaction }
          )
        }

        return items.map((item) => item.mId)
      })

      // Return the affected modules with their freshly persisted priorities.
      const modules = await models.Module.schema(this.tenant).findAll({
        where: { mId: updatedIds }
      })

      return modules
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}