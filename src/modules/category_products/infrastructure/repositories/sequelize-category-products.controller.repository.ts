import { UniqueConstraintError } from 'sequelize'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { ProductCategory } from '../../domain/entities/category_products.entity'
import { CategoryProductRepository } from '../../domain/repositories/category_products.repository'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'


export class SequelizeCategoryProductRepository implements CategoryProductRepository {
  private readonly tenant: string

  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async create(data: ProductCategory): Promise<ProductCategory> {
    try {
      const created = await models.CategoryProduct.schema(this.tenant).create({
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
        pState: created.pState ?? 0, // Ensure pState is always a number
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
  async getAll(): Promise<ProductCategory[] | []> {
    try {
      const categories = await models.CategoryProduct.schema(this.tenant).findAll()
      return categories.map(category => new ProductCategory({
        ...category.get(),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        pState: category.pState ?? 0 // Ensure pState is always a number
      }))
    } catch (e) {
      console.error('Error in SequelizeCategoryProductRepository.getAll:', e)
      throw new Error('Error al obtener las categorías')
    }
  }
}

