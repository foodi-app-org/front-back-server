import { ProductCategory } from '../entities/category_products.entity'

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
  // findById(id: string): Promise<ProductCategory | null>
  // update(id: string, data: Partial<ProductCategory>): Promise<ProductCategory | null>
  // delete(id: string): Promise<void>
}
