import { Product } from '../../domain/entities/products.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'

export interface UpdateStatusProductDTO {
  pId: string
  pState: number
}

export interface ResponseUpdateStatusProduct {
  success: boolean
  message: string
  data: Product | null
}

/**
 * Estados permitidos para un producto.
 *
 *  1 = ACTIVE
 *  0 = INACTIVE
 * -1 = ARCHIVED
 */
const VALID_PRODUCT_STATES = new Set<number>([
  1,
  0,
  -1
])

/**
 * Use case responsible for updating a product status.
 */
export class UpdateStatusProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(
    input: UpdateStatusProductDTO
  ): Promise<ResponseUpdateStatusProduct> {
    const pId = String(input?.pId ?? '').trim()
    const pState = input?.pState

    // 1. Validate product ID.
    if (!pId) {
      return {
        success: false,
        message: 'El identificador del producto (pId) es requerido',
        data: null
      }
    }

    // 2. Validate the new status.
    if (
      typeof pState !== 'number' ||
      !Number.isInteger(pState) ||
      !VALID_PRODUCT_STATES.has(pState)
    ) {
      return {
        success: false,
        message: 'El estado del producto no es válido. Los estados permitidos son 1, 0 y -1',
        data: null
      }
    }

    try {
      // 3. Update the product without filtering by its current status.
      const updatedProduct =
        await this.productRepository.updateStatusProduct(
          pId,
          pState
        )

      if (!updatedProduct) {
        return {
          success: false,
          message: 'No se encontró el producto o no fue posible actualizar su estado',
          data: null
        }
      }

      return {
        success: true,
        message: this.getSuccessMessage(pState),
        data: updatedProduct
      }
    } catch (error) {
      console.error(
        'UpdateStatusProductUseCase.execute:',
        error
      )

      throw error instanceof Error
        ? error
        : new Error(String(error))
    }
  }

  private getSuccessMessage(pState: number): string {
    switch (pState) {
      case 1:
        return 'Producto activado correctamente'

      case 0:
        return 'Producto desactivado correctamente'

      case -1:
        return 'Producto archivado correctamente'

      default:
        return 'Estado del producto actualizado correctamente'
    }
  }
}