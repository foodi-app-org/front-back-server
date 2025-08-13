import { ShoppingCartRepository } from '../../domain/repositories/shopping.repository'

/**
 * Response type for sum price use case.
 */
interface ResponseOrderStatusType {
  success: boolean
  message: string
  data: number | null | string
}

/**
 * Use case responsible for summing the price of shopping cart items by reference code.
 */
export class SumPriceShoppingCartUseCase  {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
  ) {}

  /**
   * Executes the sum price operation.
   * @param shoppingCartRefCode - Reference code of the shopping cart
   * @returns Result containing success status, message, and sum value or error message
   */
  async execute(shoppingCartRefCode: string): Promise<ResponseOrderStatusType> {
    try {
      const sum = await this.shoppingCartRepository.sumPrice(shoppingCartRefCode)

      return {
        success: true,
        message: 'Sum price calculated successfully',
        data: sum ?? 0,
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        success: false,
        message: `Failed to calculate sum price: ${message}`,
        data: null,
      }
    }
  }
}
