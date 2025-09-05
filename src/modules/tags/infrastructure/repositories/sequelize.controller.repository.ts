import { Transaction } from 'sequelize'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { TagProductEntity } from '../../domain/entities/tags.entity'
import { TagProductRepository } from '../../domain/repositories/tags.repository'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

export class SequelizeTagsRepository implements TagProductRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant?: string) {
    if (tenant) {
      this.tenant = tenant ?? MigrationFolder.Public
    }
  }

  async create(data: TagProductEntity, transaction?: Transaction): Promise<TagProductEntity | null> {
    try {
      const created = await models.TagProduct.create({
        ...data,
      }, transaction ? { transaction } : undefined)
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}