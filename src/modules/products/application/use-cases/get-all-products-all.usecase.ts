
import { ProductPagination } from '../../domain/entities/products.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'

/**
 * Use case responsible for creating a new store
 */
export class GetAllProductsAllUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(idStore: string): Promise<ProductPagination | null> {

    const created = await this.productRepository.getAll(idStore)
    return created
  }
}
