import { Product, ProductPagination } from '../entities/products.entity'

/**
 * Repository contract for StatusTypesOrderTypesRepository operations
 */
export interface ProductRepository {
  create(data: Product): Promise<Product | null>
  findCode(pCodeRef: string): Promise<Product | null>
  findByProBarCode(ProBarCode: string): Promise<Product | null>
  getAll(idStore: string): Promise<ProductPagination | null>
  findById(id: string): Promise<Product | null>
  getAllByCategoryId(categoryId: string): Promise<Product[] | null>
  update(id: string, data: Partial<Product>): Promise<Product | null>
}
