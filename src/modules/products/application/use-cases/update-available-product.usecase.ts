import { AvailableProduct } from '../../domain/entities/available_product.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'

/**
 * Input DTO to update (sync) the availability schedule of a product.
 */
export type UpdateAvailableProductDTO = Partial<AvailableProduct>[]

/**
 * Standard response type for AvailableProduct use cases.
 */
interface ResponseAvailableProduct {
  success: boolean
  message: string
  data: AvailableProduct[] | null
  errors?: { message: string; path?: string[] }[]
}

/**
 * Use case responsible for UPDATING (synchronizing) the full weekly
 * availability of a product. Unlike the register use case, this reconciles
 * the desired set against what is stored: it creates new days, updates the
 * time range of existing ones, and removes the days no longer present.
 *
 * Scenarios covered:
 *  - Missing pId / idStore       -> validation error.
 *  - Empty input                 -> clears the schedule (available all week).
 *  - Invalid time range          -> validation error (startDate >= endDate).
 *  - Product not found for store -> clear business error.
 *  - Repository failure          -> wrapped error response.
 */
export class UpdateAvailableProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository
  ) { }

  /**
   * Executes the schedule update for a single product.
   * @param {string} pId - The product id whose schedule is updated.
   * @param {string} idStore - The owning store id.
   * @param {UpdateAvailableProductDTO} input - Desired days + time ranges.
   * @returns {Promise<ResponseAvailableProduct>} The reconciled schedule.
   */
  async execute(
    pId: string,
    idStore: string,
    input: UpdateAvailableProductDTO
  ): Promise<ResponseAvailableProduct> {
    try {
      if (!pId || !idStore) {
        return {
          success: false,
          message: 'pId and idStore are required to update availability',
          data: null,
          errors: [{ message: 'Missing pId or idStore', path: ['pId', 'idStore'] }]
        }
      }

      const items = Array.isArray(input) ? input : []

      // Validate every time range before touching the database.
      for (const item of items) {
        if (item.startDate && item.endDate) {
          const start = this.parseTime(item.startDate)
          const end = this.parseTime(item.endDate)

          if (start >= end) {
            return {
              success: false,
              message: 'Validation error: startDate must be less than endDate',
              data: null,
              errors: [{
                message: `Invalid time range: ${item.startDate} - ${item.endDate}`,
                path: ['startDate', 'endDate']
              }]
            }
          }
        }
      }

      // The product must exist for this store before syncing its schedule.
      const existingProduct = await this.productRepository.findByProductAndStore(pId, idStore)

      if (!existingProduct) {
        return {
          success: false,
          message: 'El producto no existe o no pertenece a esta tienda',
          data: null,
          errors: [{
            message: `Product not found: pId=${pId}, idStore=${idStore}`,
            path: ['pId']
          }]
        }
      }

      const data = await this.productRepository.syncAvailableProductSchedule(
        pId,
        idStore,
        items
      )

      return {
        success: true,
        message: items.length
          ? 'Availability schedule updated successfully'
          : 'Availability schedule cleared (available all week)',
        data
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)

      return {
        success: false,
        message: 'Unexpected error while updating AvailableProduct schedule',
        data: null,
        errors: [{ message, path: ['execute'] }]
      }
    }
  }

  /**
   * Utility to parse an `HH:mm` string into minutes since midnight.
   * @param {string} time - Time in 24h `HH:mm` format.
   * @returns {number} Minutes since midnight.
   */
  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
}
