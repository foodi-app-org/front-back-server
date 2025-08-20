import { Transaction } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Module } from '../../domain/entities/modules.entity'
import { ModuleRepository } from '../../domain/repositories/module.repository'

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
      const modules = await models.Module.schema(this.tenant).findAll()
      return modules
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}