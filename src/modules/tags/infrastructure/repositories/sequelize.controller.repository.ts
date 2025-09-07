import { Transaction } from 'sequelize'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { ShoppingCartPagination, TagProductEntity, TagState } from '../../domain/entities/tags.entity'
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
        searchFields: ['nameTag'],
        idStore,
        where: { 
          state: TagState.ACTIVE,
          
        }
      })
      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async findByIdOrName(idStore: string, tgId?: string, nameTag?: string): Promise<TagProductEntity | null> {
    try {
      const whereClause: Record<string, any> = { idStore }
      if (tgId) {
        whereClause.tgId = tgId
      }
      if (nameTag) {
        whereClause.nameTag = nameTag
      }
      const tag = await models.TagProduct.schema(this.tenant).findOne({ where: whereClause })
      return tag
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async updateState(tgId: string, state: number, idStore: string): Promise<void> {
    try {
      await models.TagProduct.schema(this.tenant).update(
        { state },
        { where: { tgId, idStore } }
      )
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}