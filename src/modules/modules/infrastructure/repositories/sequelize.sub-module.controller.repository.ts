import { Transaction } from 'sequelize'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Submodule } from '../../domain/entities/sub-modules.entity'
import { SubmoduleRepository } from '../../domain/repositories/sub-module.repository'

export class SequelizeSubModuleOrderRepository implements SubmoduleRepository {

  async create(data: Submodule, transaction?: Transaction): Promise<Submodule | null> {
    try {
      const created = await models.Submodule.create({
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
}