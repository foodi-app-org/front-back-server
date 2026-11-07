
import { Transaction } from 'sequelize'

import { ProductRepository } from '../../../products/domain'
import { IShoppingCart, ShoppingCart } from '../../domain/entities/shopping.entity'
import { ShoppingCartRepository } from '../../domain/repositories/shopping.repository'

/**
 * Input DTO to create a ShoppingCart.
 */
export type CreateIShoppingCartDTO = IShoppingCart & {
  pCodeRef: string
}

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
  async execute(input: CreateIShoppingCartDTO, transaction?: Transaction): Promise<ResponseOrderStatusType | null> {
    const product = await this.productRepository.findById(input.pId)
    if (!product) {
      return {
        success: false,
        message: `Product with id ${input.pId}  not found`,
        data: null
      }
    }

    // Price resolution:
    //  - Courtesy line (`free === true`): the product is a gift, so the
    //    persisted `priceProduct` is forced to 0 and NEVER taken from the
    //    catalog. This keeps the gift out of accounting, reports, daily sales
    //    and the store's general sales (all of which read `priceProduct`).
    //  - Normal line: honor the unit price resolved by the caller
    //    (`input.priceProduct`, which the resolver reconciles from ProPrice).
    //    It previously overrode this with the catalog `product.ProPrice`, which
    //    is exactly why a free/zero-priced line still persisted the real price.
    //    Falls back to the catalog price only when the caller did not send one.
    const resolvedPrice = input.free === true
      ? 0
      : (Number.isFinite(Number(input.priceProduct))
        ? Number(input.priceProduct)
        : (product.ProPrice ?? 0))

    // sum price of product by cantProducts
    const newIShoppingCart = new ShoppingCart({
      ...input,
      priceProduct: resolvedPrice,
      free: input.free === true,
      pId: String(product.pId),
      cantProducts: input.cantProducts
    })
    const created = await this.shoppingCartRepository.create(newIShoppingCart, transaction)

    return {
      success: true,
      message: 'Shopping created successfully',
      data: created
    }
  }
}
