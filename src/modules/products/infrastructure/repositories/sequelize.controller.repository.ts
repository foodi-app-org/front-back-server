import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { Product, ProductPagination } from '../../domain/entities/products.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'
import type { SequelizeProductModel } from '../db/sequelize/models/sequelize-product.model'

export class SequelizeProductRepository implements ProductRepository {
  private readonly genericService: GenericService<SequelizeProductModel>

  constructor() {
    this.genericService = new GenericService(models.Product)
  }

  async create(data: Product): Promise<Product | null> {
    try {
      const created = await models.Product.create({
        ...data,
      })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findCode(pCodeRef: string): Promise<Product | null> {
    try {
      const scheduleStore = models.Product.findOne({
        where: { pCode: String(pCodeRef) },
      })
      return scheduleStore
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async getAll(idStore: string): Promise<ProductPagination | null> {
    try {
      const result = await this.genericService.getAll({
        searchFields: ['pCodeRef'],
        idStore
      })

      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async findById(id: string): Promise<Product | null> {
    try {
      const Product = await models.Product.findOne({ where: { pId: id } })
      if (!Product) {
        return null
      }
      return Product
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async findByProBarCode(id: string): Promise<Product | null> {
    try {
      const Product = await models.Product.findOne({ where: { ProBarCode: id } })
      if (!Product) {
        return null
      }
      return Product
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}