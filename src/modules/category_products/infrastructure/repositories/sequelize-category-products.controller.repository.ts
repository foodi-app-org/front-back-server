import { Op, UniqueConstraintError } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { SequelizeCategoryProductModel } from '../db/sequelize/models/sequelize-model'
import { ProductCategory } from '../../domain/entities/category_products.entity'
import { CategoryProductRepository, CategoryProductsPage } from '../../domain/repositories/category_products.repository'
import type { PaginationOptions } from '../../../../shared/infrastructure/persistence/generic-service/pagination/types'

/** Tenant-scoped repository. No changes to the existing non-paginated queries. */
export class SequelizeCategoryProductRepository implements CategoryProductRepository {
  private readonly tenant: string
  private readonly genericService: GenericService<SequelizeCategoryProductModel>

  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
    this.genericService = new GenericService(models.CategoryProduct)
  }

  async create(data: ProductCategory): Promise<ProductCategory> {
    try {
      const created = await models.CategoryProduct.schema(this.tenant).create({
        ...data,
        createdAt: new Date(),
        pName: data.pName,
        ProDescription: data.ProDescription
      })
      return new ProductCategory({
        ...created.get(),
        pName: created.pName,
        ProDescription: created.ProDescription,
        carProId: created.carProId,
        pState: created.pState ?? 0
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
        ...category.get(), createdAt: category.createdAt,
        updatedAt: category.updatedAt, pState: category.pState ?? 0
      }))
    } catch (e) {
      console.error('Error in SequelizeCategoryProductRepository.getAll:', e)
      throw new Error('Error al obtener las categorías')
    }
  }

  /**
   * GenericService applies getTenantName(idStore) itself. Pass the RAW store ID,
   * never this.tenant (which already includes tenant_).
   * Note that pagination metadata and nextCursor come from GenericService.
   */
  async getPaginated(
    idStore: string,
    pagination: PaginationOptions = {},
    filters: { search?: string; pState?: number } = {}
  ): Promise<CategoryProductsPage> {
    const page = Math.max(1, Math.floor(pagination.page ?? 1))
    const max = Math.max(1, Math.min(100, Math.floor(pagination.max ?? 20)))
    const search = filters.search?.trim().replace(/\s+/g, ' ')
    const where: Record<string, unknown> = {}
    if (search) where.search = search
    // Status 0 must be accepted (inactive). Undefined = all states.
    if (filters.pState !== undefined && filters.pState !== null) where.pState = filters.pState

    const result = await this.genericService.getAll({
      idStore,
      searchFields: ['pName', 'ProDescription'],
      where,
      orderFields: [
        { field: 'createdAt', direction: 'DESC' },
        { field: 'carProId', direction: 'DESC' }
      ],
      pagination: {
        mode: pagination.mode ?? 'offset',
        page, max,
        ...(pagination.cursor ? { cursor: pagination.cursor } : {})
      }
    })
    return {
      success: result.success,
      message: result.message,
      data: result.data.map(category => new ProductCategory({
        ...category.get(),
        pState: category.pState ?? 0
      })),
      pagination: result.pagination,
      ...('nextCursor' in result ? { nextCursor: result.nextCursor } : {})
    }
  }

  async findById(carProId: string): Promise<ProductCategory | null> {
    try {
      const category = await models.CategoryProduct.schema(this.tenant).findOne({ where: { carProId } })
      return category ? new ProductCategory({
        ...category.get(), createdAt: category.createdAt,
        updatedAt: category.updatedAt, pState: category.pState ?? 0
      }) : null
    } catch (e) {
      console.error('Error in SequelizeCategoryProductRepository.findById:', e)
      throw new Error('Error al obtener la categoría por id')
    }
  }

  async getByName(name: string): Promise<ProductCategory | null> {
    try {
      const category = await models.CategoryProduct.schema(this.tenant).findOne({ where: { pName: name } })
      return category ? new ProductCategory({
        ...category.get(), createdAt: category.createdAt,
        updatedAt: category.updatedAt, pState: category.pState ?? 0
      }) : null
    } catch (e) {
      console.error('Error in SequelizeCategoryProductRepository.getByName:', e)
      throw new Error('Error al obtener la categoría por nombre')
    }
  }

  // Retained exactly for backward compatibility with existing GraphQL consumers.
  async getCatProductsWithProduct(filters: {
    search?: string; min?: number; max?: number; gender?: string[];
    desc?: string[]; categories?: string[]; idStore?: string
  }): Promise<{ totalCount: number; catProductsWithProduct: ProductCategory[] }> {
    try {
      const { search, min, max, gender, desc, categories, idStore } = filters
      let whereSearch: Record<string, unknown> = {}
      if (search) whereSearch = {
        ...whereSearch, [Op.or]: [{ pName: { [Op.substring]: search.replace(/\s+/g, ' ') } }]
      }
      if (gender?.length) whereSearch = { ...whereSearch, ProDelivery: { [Op.in]: gender } }
      if (desc?.length) whereSearch = { ...whereSearch, ProDescuento: { [Op.in]: desc } }
      if (categories?.length) whereSearch = { ...whereSearch, caId: { [Op.in]: categories } }
      if (idStore) whereSearch = { ...whereSearch, idStore }
      const { count, rows } = await models.CategoryProduct.schema(this.tenant).findAndCountAll({
        where: { [Op.and]: [whereSearch] },
        limit: max ?? 400, offset: min ?? 0, order: [['createdAt', 'ASC']]
      })
      return {
        totalCount: count,
        catProductsWithProduct: rows.map(category => new ProductCategory({
          ...category.get(), createdAt: category.createdAt,
          updatedAt: category.updatedAt, pState: category.pState ?? 0
        }))
      }
    } catch (e) {
      console.error('Error in SequelizeCategoryProductRepository.getCatProductsWithProduct:', e)
      return { totalCount: 0, catProductsWithProduct: [] }
    }
  }
}
