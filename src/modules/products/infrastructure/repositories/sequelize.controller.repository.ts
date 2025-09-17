import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import {
  Product,
  ProductPagination,
  StateProduct
} from '../../domain/entities/products.entity'
import { AvailableProduct } from '../../domain/entities/available_product.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'
import type { SequelizeProductModel } from '../db/sequelize/models/sequelize-product.model'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { Op } from 'sequelize'
import { StateProductAvailable } from '../db/sequelize/models/sequelize-available-product.model'

export class SequelizeProductRepository implements ProductRepository {
  private readonly genericService: GenericService<SequelizeProductModel>
  private readonly tenant: string


  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
    this.genericService = new GenericService(models.Product)
  }


  async create(data: Product): Promise<Product | null> {
    try {
      const created = await models.Product.schema(this.tenant).create({
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
      const scheduleStore = models.Product.schema(this.tenant).findOne({
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
        idStore,
        where: {
          pState: { [Op.gt]: 0 }
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
  async findById(id: string): Promise<Product | null> {
    try {
      const Product = await models.Product.schema(this.tenant).findOne({
        where: {
          pId: id,
          pState: StateProduct.ACTIVE
        }
      })
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
      const Product = await models.Product.schema(this.tenant).findOne({ where: { ProBarCode: id } })
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

  /**
   * Get all active products by category that are associated and available today.
   *
   * @param {string} categoryId - The category id to filter products.
   * @returns {Promise<Product[] | null>} - List of products or null if not found.
   */
  async getAllByCategoryId(categoryId: string): Promise<Product[] | null> {
    models.Product.hasMany(models.AvailableProduct, { foreignKey: 'pId' })
    models.AvailableProduct.belongsTo(models.Product, { foreignKey: 'pId' })
    // 00:00 - 23:59 format
    try {
      const products = await models.Product.schema(this.tenant).findAll({
        where: {
          carProId: categoryId,
          pState: StateProduct.ACTIVE
        },
        include: [{
          model: models.AvailableProduct.schema(this.tenant),
          where: {
            state: StateProductAvailable.ACTIVE,
          },
          required: false // Use left join to include products without available entries
        }]
      })

      if (!products || products.length === 0) {
        return null
      }

      return products

    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    try {
      const [affectedCount, updatedRows] = await models.Product.schema(this.tenant).update(data, {
        where: { pId: id },
        returning: true
      })
      if (!affectedCount || !updatedRows || updatedRows.length === 0) {
        return null
      }
      return updatedRows[0]
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async updateImage(id: string, image: string): Promise<Product | null> {
    try {
      const [affectedCount, updatedRows] = await models.Product.schema(this.tenant).update({ ProImage: image }, {
        where: { pId: id },
        returning: true
      })
      if (!affectedCount || !updatedRows || updatedRows.length === 0) {
        return null
      }
      return updatedRows[0]
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findByProductAndStore(pId: string, idStore: string): Promise<Product | null> {
    try {
      const product = await models.Product.schema(this.tenant).findOne({
        where: {
          pId,
          idStore
        }
      })
      if (!product) {
        return null
      }
      return product
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async createAvailableProduct(data: Partial<Product>): Promise<AvailableProduct | null> {
    try {
      const created = await models.AvailableProduct.schema(this.tenant).create({
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
}
