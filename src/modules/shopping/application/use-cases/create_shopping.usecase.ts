
import { ProductRepository } from '../../../products/domain'
import { IShoppingCart, ShoppingCart } from '../../domain/entities/shopping.entity'
import { ShoppingCartRepository } from '../../domain/repositories/shopping.repository'

/**
 * Input DTO to create a ShoppingCart.
 */
export type CreateIShoppingCartDTO = IShoppingCart  

interface ResponseOrderStatusType {
  success: boolean
  message: string
  data: ShoppingCart | null
}
/**
 * Use case responsible for creating a ShoppingCart.
 */
export class CreateIShoppingCartTypeUseCase {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
    private readonly productRepository: ProductRepository
  ) { }

  /**
   * Executes the use case to create a ShoppingCart.
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(input: CreateIShoppingCartDTO): Promise<ResponseOrderStatusType | null> {
    const product = await this.productRepository.findById(input.pId)
    if (!product) {
      return {
        success: false,
        message: 'Product not found',
        data: null,
      }
    }
    // sum price of product by cantProducts
    const newIShoppingCart = new ShoppingCart({
      ...input,
      priceProduct: (product?.ProPrice ?? 0) * (input.cantProducts ?? 1),
    })

    const created = await this.shoppingCartRepository.create(newIShoppingCart)

    return {
      success: true,
      message: 'Shopping created successfully',
      data: created,
    }
  }
}
