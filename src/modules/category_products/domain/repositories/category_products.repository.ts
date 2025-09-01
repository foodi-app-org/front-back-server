import { ProductCategory } from '../entities/category_products.entity'

/**
 * Repository contract for ProductCategory operations
 */
export interface CategoryProductRepository {
  create(data: ProductCategory): Promise<ProductCategory>
  getAll(): Promise<ProductCategory[] | []>
  // findById(id: string): Promise<ProductCategory | null>
  // update(id: string, data: Partial<ProductCategory>): Promise<ProductCategory | null>
  // delete(id: string): Promise<void>
}
