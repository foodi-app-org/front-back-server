
import { ShoppingCart } from '../../domain/entities/shopping.entity'
import { ShoppingCartRepository } from '../../domain/repositories/shopping.repository'


/**
 * Use case responsible for creating a ShoppingCart.
 */
export class GetAllByCodeRefShoppingCartTypeUseCase {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository
  ) { }

  /**
   * Executes the use case to create a ShoppingCart.
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(shoppingCartRefCode: string, pCodeRef: string): Promise<ShoppingCart[] | null> {
    const shopping = await this.shoppingCartRepository.getAllByRefCode(shoppingCartRefCode, pCodeRef)
    if (!shopping) {
      return null
    }
    return shopping
  }
}
