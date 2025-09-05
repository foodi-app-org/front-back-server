import { UniqueConstraintError, Op } from 'sequelize'
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
        pState: created.pState ?? 0,
      })
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new Error(`Duplicate entry: ${e.errors?.[0]?.message ?? 'Unique constraint violated'}`)
      }
      if (e instanceof Error) throw new Error(e.message)
      throw new Error(String(e))
    }
  }

  async getAll(): Promise<ProductCategory[]> {
    try {
      const categories = await models.CategoryProduct.schema(this.tenant).findAll()
      return categories.map(category => new ProductCategory({
        ...category.get(),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        pState: category.pState ?? 0,
      }))
    } catch (e) {
      console.error('Error in SequelizeCategoryProductRepository.getAll:', e)
      throw new Error('Error al obtener las categorías')
    }
  }

  async getByName(name: string): Promise<ProductCategory | null> {
    try {
      const category = await models.CategoryProduct.schema(this.tenant).findOne({
        where: { pName: name }
      })
      return category
        ? new ProductCategory({
          ...category.get(),
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          pState: category.pState ?? 0,
        })
        : null
    } catch (e) {
      console.error('Error in SequelizeCategoryProductRepository.getByName:', e)
      throw new Error('Error al obtener la categoría por nombre')
    }
  }

  async getCatProductsWithProduct(filters: {
    search?: string
    min?: number
    max?: number
    gender?: string[]
    desc?: string[]
    categories?: string[]
    idStore?: string
  }): Promise<{ totalCount: number; catProductsWithProduct: ProductCategory[] }> {
    try {
      const {
        search,
        min,
        max,
        gender,
        desc,
        categories,
        idStore
      } = filters

      let whereSearch: any = {}

      if (search) {
        whereSearch = {
          ...whereSearch,
          [Op.or]: [
            { pName: { [Op.substring]: search?.replace(/\s+/g, ' ') } }
          ]
        }
      }

      if (gender?.length) {
        whereSearch = {
          ...whereSearch,
          ProDelivery: { [Op.in]: gender }
        }
      }

      if (desc?.length) {
        whereSearch = {
          ...whereSearch,
          ProDescuento: { [Op.in]: desc }
        }
      }

      if (categories?.length) {
        whereSearch = {
          ...whereSearch,
          caId: { [Op.in]: categories.map(x => x) }
        }
      }

      if (idStore) {
        whereSearch = {
          ...whereSearch,
          idStore
        }
      }

      const { count, rows } = await models.CategoryProduct.schema(this.tenant).findAndCountAll({
        where: {
          [Op.and]: [whereSearch]
        },
        limit: max ?? 400,
        offset: min ?? 0,
        order: [['createdAt', 'ASC']]
      })

      return {
        totalCount: count,
        catProductsWithProduct: rows.map(category => new ProductCategory({
          ...category.get(),
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          pState: category.pState ?? 0,
        }))
      }
    } catch (e) {
      console.error('Error in SequelizeCategoryProductRepository.getCatProductsWithProduct:', e)
      return { totalCount: 0, catProductsWithProduct: [] }
    }
  }
}
