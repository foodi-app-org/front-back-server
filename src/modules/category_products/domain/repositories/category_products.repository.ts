import { ProductCategory } from '../entities/category_products.entity'
import type { PaginationOptions, PaginationMeta } from '../../../../shared/infrastructure/persistence/generic-service/pagination/types'

export interface CategoryProductsPage {
  success: boolean
  message: string
  data: ProductCategory[]
  pagination: PaginationMeta
  nextCursor?: string | null
}

/**
 * Repository contract for ProductCategory operations
 */
export interface CategoryProductRepository {
  create(data: ProductCategory): Promise<ProductCategory>
  getAll(): Promise<ProductCategory[] | []>
  getByName(name: string): Promise<ProductCategory | null>
    /**
   * Retrieves categories with products applying filters.
   * @param filters - Search and filter params.
   * @returns An object with total count and product categories.
   */
  getCatProductsWithProduct(
    filters: {
      search?: string
      min?: number
      max?: number
      gender?: string[]
      desc?: string[]
      categories?: string[]
      idStore?: string
    }
  ): Promise<{ totalCount: number; catProductsWithProduct: ProductCategory[] }>
  /**
   * Retrieves a single category by its primary key (`carProId`).
   * @param carProId - Category identifier.
   * @returns The category or null when it does not exist.
   */
  findById(carProId: string): Promise<ProductCategory | null>
  // update(id: string, data: Partial<ProductCategory>): Promise<ProductCategory | null>
  // delete(id: string): Promise<void>
  getPaginated(
    idStore: string,
    pagination: PaginationOptions,
    filters?: { search?: string; pState?: number }
  ): Promise<CategoryProductsPage>
}
