import { AvailableProduct } from '../../domain/entities/available_product.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'



/**
 * Input DTO to register one or more AvailableProducts
 */
export type RegisterAvailableProductDTO = AvailableProduct | AvailableProduct[]

/**
 * Standard response type for AvailableProduct use cases
 */
interface ResponseAvailableProduct {
  success: boolean
  message: string
  data: AvailableProduct | AvailableProduct[] | null
  errors?: { message: string; path?: string }[]
}

/**
 * Use case responsible for registering available products
 */
export class RegisterAvailableProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository
  ) { }

  /**
   * Executes the use case to register one or multiple available products
   * @param input - available product(s) data
   * @returns Response with created AvailableProduct(s)
   */
  async execute(input: RegisterAvailableProductDTO): Promise<ResponseAvailableProduct> {
    try {
      if (!input) {
        return {
          success: false,
          message: 'Input data is required',
          data: null,
          errors: [{ message: 'No data provided', path: 'input' }]
        }
      }

      // Normalize input into an array
      const products = Array.isArray(input) ? input : [input]

      const createdProducts: AvailableProduct[] = []

      for (const prod of products) {
        // ✅ Validation: startDate must be less than endDate
        if (prod.startDate && prod.endDate) {
          const start = this.parseTime(prod.startDate)
          const end = this.parseTime(prod.endDate)

          if (start >= end) {
            return {
              success: false,
              message: 'Validation error: startDate must be less than endDate',
              data: null,
              errors: [{
                message: `Invalid time range: ${prod.startDate} - ${prod.endDate}`,
                path: 'startDate/endDate'
              }]
            }
          }
        }
        // Create the AvailableProduct
        const created = await this.productRepository.createAvailableProduct(prod)

        if (!created) {
          return {
            success: false,
            message: 'Failed to create AvailableProduct',
            data: null
          }
        }

        createdProducts.push(created)
      }

      return {
        success: true,
        message: 'AvailableProduct(s) created successfully',
        data: Array.isArray(input) ? createdProducts : createdProducts[0]
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Unexpected error while creating AvailableProduct(s)',
        data: null,
        errors: [{ message: error.message, path: 'execute' }]
      }
    }
  }
  /**
 * Utility to parse HH:mm string into minutes
 */
  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
}
