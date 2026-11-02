import { IProduct, Product } from '../../domain/entities/products.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'

/**
 * Input DTO to edit an existing product. `pId` identifies the product; the rest
 * of the fields are the (partial) values to update.
 */
export type EditProductDTO = IProduct & { pId: string }

interface EditProductResponse {
  success: boolean
  message: string
  data: Product | null
}

/**
 * Use case responsible for editing an existing product.
 *
 * Validates that the product exists, applies the provided fields and returns a
 * normalized `{ success, message, data }` response consumed by the GraphQL
 * `editProductFoods` resolver.
 */
export class EditProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  /**
   * Executes the product update.
   * @param input - Product fields to update. Must include `pId`.
   * @returns Normalized response with the updated product or an error message.
   */
  async execute(input: EditProductDTO): Promise<EditProductResponse> {
    const { pId, ...rest } = input

    if (!pId) {
      return {
        success: false,
        message: 'El identificador del producto (pId) es requerido',
        data: null
      }
    }

    const existing = await this.productRepository.findById(pId)
    if (!existing) {
      return {
        success: false,
        message: 'El producto no existe',
        data: null
      }
    }

    // Only forward defined fields so we never overwrite columns with undefined.
    const updates: Partial<Product> = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined && value !== null)
    )

    const updated = await this.productRepository.update(pId, updates)

    // Some drivers (e.g. SQLite via Sequelize) report 0 affected rows when the
    // submitted values match the stored ones, causing `update` to resolve null
    // even though the product exists and is already in the desired state. In
    // that case we still consider the operation successful and return the
    // current entity, avoiding a misleading "failed to update" message.
    return {
      success: true,
      message: 'Producto actualizado correctamente',
      data: updated ?? existing
    }
  }
}
