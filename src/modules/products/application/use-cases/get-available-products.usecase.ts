import { AvailableProduct } from '../../domain/entities/available_product.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'

/**
 * Standard response for the "read availability" use case.
 */
export interface GetAvailableProductsResponse {
  success: boolean
  message: string
  data: AvailableProduct[]
  errors?: { message: string; path?: string[] }[]
}

/**
 * Use case responsible for reading the availability schedule of a product.
 *
 * Scenarios covered:
 *  - Missing `pId`           -> success=false with a clear validation error.
 *  - Product without schedule -> success=true with an empty list (available all week).
 *  - Repository error         -> success=false with the underlying message.
 */
export class GetAvailableProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(pId: string, idStore?: string): Promise<GetAvailableProductsResponse> {
    if (!pId) {
      return {
        success: false,
        message: 'pId is required to read product availability',
        data: [],
        errors: [{ message: 'Missing pId', path: ['pId'] }]
      }
    }

    try {
      const data = await this.productRepository.getAvailableProductsByProduct(pId, idStore)

      return {
        success: true,
        message: data.length
          ? 'Availability schedule retrieved successfully'
          : 'Product has no explicit availability (available all week)',
        data
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)

      return {
        success: false,
        message: 'Unexpected error while reading product availability',
        data: [],
        errors: [{ message, path: ['execute'] }]
      }
    }
  }
}
