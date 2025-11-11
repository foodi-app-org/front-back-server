import { AvailableProduct } from '../entities/available_product.entity'
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
  updateImage(id: string, image: string): Promise<Product | null>
  findByProductAndStore(pId: string, idStore: string): Promise<Product | null>
  createAvailableProduct(data: Partial<AvailableProduct>): Promise<AvailableProduct | null>

  // sold products
  createProductSold(originalPid: string, pCodeRef: string, product: Partial<Product>): Promise<Product | null>
  getAllProductSoldByPCodeRef(pCodeRef: string): Promise<Product[] | null>
}
