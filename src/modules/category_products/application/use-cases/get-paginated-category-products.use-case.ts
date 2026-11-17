import type { PaginationOptions } from '../../../../shared/infrastructure/persistence/generic-service/pagination/types'
import type { CategoryProductsPage, CategoryProductRepository } from '../../domain/repositories/category_products.repository'

export class GetPaginatedCategoryProductsUseCase {
  constructor(private readonly repository: CategoryProductRepository) {}

  async execute(
    idStore: string,
    pagination: PaginationOptions = { mode: 'offset', page: 1, max: 20 },
    filters: { search?: string; pState?: number } = {}
  ): Promise<CategoryProductsPage> {
    if (!idStore?.trim()) throw new Error('Restaurant is required in context')
    return this.repository.getPaginated(idStore, pagination, filters)
  }
}
