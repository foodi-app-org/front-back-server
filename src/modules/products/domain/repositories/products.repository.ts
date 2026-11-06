import { QueryProductFoodsAllArgs } from 'generated/graphql'
import { AvailableProduct } from '../entities/available_product.entity'
import { Product, ProductPagination } from '../entities/products.entity'

/**
 * Structured, reusable filters for listing products.
 * All fields are optional so the same contract powers any filter combination.
 */
export interface ProductListFilters {
  /** Category ids to match against `carProId`. */
  categories?: string[]
  /** Product state (`pState`). */
  pState?: number
  /** Minimum price (`ProPrice >=`). */
  priceMin?: number
  /** Maximum price (`ProPrice <=`). */
  priceMax?: number
  /** Dynamic sort list in 'FIELD:ASC' | 'FIELD:DESC' format. */
  orderBy?: string[]
}

/**
 * Repository contract for StatusTypesOrderTypesRepository operations
 */
export interface ProductRepository {
  create(data: Product): Promise<Product | null>
  findCode(pCodeRef: string): Promise<Product | null>
  /** Busca un producto ACTIVO por código de barras (scope tenant). */
  findByProBarCode(ProBarCode: string): Promise<Product | null>
  /**
   * Busca un producto por código de barras en CUALQUIER estado (para validar
   * unicidad). Unicidad por tienda: opcionalmente filtra por `idStore`.
   */
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
  updateImage(id: string, image: string): Promise<Product | null>
  findByProductAndStore(pId: string, idStore: string): Promise<Product | null>
  createAvailableProduct(data: Partial<AvailableProduct>): Promise<AvailableProduct | null>
  /**
   * Lists the availability schedule (days + time ranges) of a product.
   * Returns active records ordered by weekday. Empty array when the product
   * has no explicit availability (interpreted as "available all week").
   */
  getAvailableProductsByProduct(pId: string, idStore?: string): Promise<AvailableProduct[]>
  /**
   * Replaces the whole availability schedule of a product with the given set.
   * Implementations must reconcile the state: create the new day/range rows,
   * update the ones that already exist, and remove the ones no longer present.
   * Passing an empty list clears the schedule (product becomes "available all
   * week"). Returns the resulting active schedule.
   */
  syncAvailableProductSchedule(
    pId: string,
    idStore: string,
    input: Partial<AvailableProduct>[]
  ): Promise<AvailableProduct[]>

  // sold products
  createProductSold(originalPid: string, pCodeRef: string, product: Partial<Product>): Promise<Product | null>
  getAllProductSoldByPCodeRef(pCodeRef: string): Promise<Product[] | null>
}
