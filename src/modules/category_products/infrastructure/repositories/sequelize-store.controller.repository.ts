import { UniqueConstraintError } from 'sequelize'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { ProductCategory } from '../../domain/entities/category_products.entity'
import { CategoryProductRepository } from '../../domain/repositories/category_products.repository'
export class SequelizeCategoryProductRepository implements CategoryProductRepository {
  async create(data: ProductCategory): Promise<ProductCategory> {
    try {
      const created = await models.CategoryProduct.create({
        ...data,
        createdAt: new Date(),
        pName: data.pName,
        ProDescription: data.ProDescription,
      })
      return new ProductCategory({
        ...created.get(),
        pName: created?.pName,
        ProDescription: created.ProDescription,
        carProId: created.carProId,
      })
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new Error(`Duplicate entry: ${e.errors?.[0]?.message ?? 'Unique constraint violated'}`)
      }
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}
