import { Transaction } from 'sequelize'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { ShoppingCartPagination, TagProductEntity } from '../../domain/entities/tags.entity'
import { TagProductRepository } from '../../domain/repositories/tags.repository'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import type { SequelizeTagProductModel } from '../db/sequelize/models/sequelize-tags.model'

export class SequelizeTagsRepository implements TagProductRepository {
  private readonly tenant: string = MigrationFolder.Public
  private readonly genericService!: GenericService<SequelizeTagProductModel>

  constructor(tenant?: string) {
    if (tenant) {
      this.tenant = tenant ?? MigrationFolder.Public
      this.genericService = new GenericService(models.TagProduct.schema(this.tenant))
    }
  }

  async create(data: TagProductEntity, transaction?: Transaction): Promise<TagProductEntity | null> {
    try {
      const created = await models.TagProduct.schema(this.tenant).create({
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
  async getAll(idStore: string): Promise<ShoppingCartPagination | null> {
    try {
      const result = await this.genericService.getAll({
        searchFields: ['pCodeRef'],
        idStore
      })
      return result
    } catch (e) {
      console.log("🚀 ~ SequelizeTagsRepository ~ findAndCountAll ~ e:", e)
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}