
import { QueryProductFoodsAllArgs } from 'generated/graphql';
import { ProductPagination } from '../../domain/entities/products.entity'
import {
  ProductRepository,
  ProductListFilters
} from '../../domain/repositories/products.repository'

/**
 * Use case responsible for listing products with optional filters.
 */
export class GetAllProductsAllUseCase {
  constructor(
    private readonly productRepository: ProductRepository
  ) { }

  /**
   * Lists products for a store applying search + dynamic filters.
   *
   * @param idStore - Store identifier (tenant/schema).
   * @param pagination - Page + page size.
   * @param search - Optional free-text search.
   * @param filters - Optional structured filters (categories, price range, state, order).
   * @returns Paginated product result or null.
   */
  async execute(
    idStore: string,
    pagination: { page: number; max: number },
    search?: QueryProductFoodsAllArgs['search'],
    filters?: ProductListFilters
  ): Promise<ProductPagination | null> {
    const value = search?.trim() ?? undefined
    const created = await this.productRepository.getAll(
      String(idStore),
      pagination,
      value,
      filters
    )
    return created
  }
}
