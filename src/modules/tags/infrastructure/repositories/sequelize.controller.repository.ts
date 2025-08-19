import { Transaction } from 'sequelize'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { TagProductEntity } from '../../domain/entities/tags.entity'
import { TagProductRepository } from '../../domain/repositories/tags.repository'

export class SequelizeTagsRepository implements TagProductRepository {

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