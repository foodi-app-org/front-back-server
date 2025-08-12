
import { IShoppingCart, ShoppingCart } from '../../domain/entities/shopping.entity'
import { ShoppingCartRepository } from '../../domain/repositories/shopping.repository'

/**
 * Input DTO to create a ShoppingCart.
 */
export type CreateIShoppingCartDTO = IShoppingCart  

/**
 * Use case responsible for creating a ShoppingCart.
 */
export class CreateIShoppingCartTypeUseCase {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
  ) { }

  /**
   * Executes the use case to create a ShoppingCart.
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(codeRef: string): Promise<ShoppingCart | null> {
    
    const shopping = await this.shoppingCartRepository.findCodeRef(codeRef)
    if (!shopping) {
      return null
    }
    return new ShoppingCart(shopping) ?? null
  }
}
