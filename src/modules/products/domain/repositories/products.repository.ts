import { QueryProductFoodsAllArgs } from 'generated/graphql'
import { AvailableProduct } from '../entities/available_product.entity'
import { Product, ProductPagination } from '../entities/products.entity'

export interface ProductListFilters {
  categories?: string[]
  pState?: number
  priceMin?: number
  priceMax?: number
  orderBy?: string[]
}

/**
 * Repository contract for Product operations.
 */
export interface ProductRepository {
  create(data: Product): Promise<Product | null>
  findCode(pCodeRef: string): Promise<Product | null>

  findByProBarCode(ProBarCode: string): Promise<Product | null>
  findAnyByProBarCode(ProBarCode: string, idStore?: string): Promise<Product | null>

  getAll(
    idStore: string,
    pagination: { page: number; max: number },
    search?: QueryProductFoodsAllArgs['search'],
    filters?: ProductListFilters
  ): Promise<ProductPagination | null>

  findById(id: string): Promise<Product | null>

  getAllByCategoryId(categoryId: string): Promise<Product[] | null>

  update(id: string, data: Partial<Product>): Promise<Product | null>

  /**
   * Actualiza únicamente el estado del producto.
   * No filtra por el estado actual, permitiendo activar productos inactivos
   * o cambiar productos archivados.
   */
  updateStatusProduct(
    pId: string,
    pState: number
  ): Promise<Product | null>

  updateImage(id: string, image: string): Promise<Product | null>

  findByProductAndStore(pId: string, idStore: string): Promise<Product | null>

  createAvailableProduct(data: Partial<AvailableProduct>): Promise<AvailableProduct | null>

  getAvailableProductsByProduct(
    pId: string,
    idStore?: string
  ): Promise<AvailableProduct[]>

  syncAvailableProductSchedule(
    pId: string,
    idStore: string,
    input: Partial<AvailableProduct>[]
  ): Promise<AvailableProduct[]>

  // Sold products
  createProductSold(
    originalPid: string,
    pCodeRef: string,
    product: Partial<Product>
  ): Promise<Product | null>

  getAllProductSoldByPCodeRef(
    pCodeRef: string
  ): Promise<Product[] | null>
}