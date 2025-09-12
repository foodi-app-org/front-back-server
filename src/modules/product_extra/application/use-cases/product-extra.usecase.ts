import { IProductExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
import { ProductExtra, StateProductExtra } from '../../domain/entities/product-optional-extra.entity'

export type UpdateProductExtraInput = Partial<ProductExtra>

export interface UseCaseResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: { message: string; path?: string }[]
}

/**
 * Use case for creating or updating optional product extras
 */
export class UpdateProductOptionalUseCase {
  constructor(
    private readonly repo: IProductExtraRepo
  ) {}

  /**
   * Execute the creation/update of multiple product extras
   * @param input - List of product extras to update/create
   * @param idStore - Store identifier
   * @returns UseCaseResponse containing an array of created/updated product extras
   */
  async execute(input: UpdateProductExtraInput[], idStore: string): Promise<UseCaseResponse> {
    try {
      const results: ProductExtra[] = []

      for (const item of input) {
        const entity = new ProductExtra({
          pId: item.pId ?? '',
          extraName: item.extraName ?? '',
          idStore,
          extraPrice: item.extraPrice,
          exState: StateProductExtra.ACTIVE,
          required: item.required ?? 0,
        })
        const updated = await this.repo.create(entity)
        if (updated) {
          results.push(updated)
        }
      }

      if (results.length > 0) {
        return {
          success: true,
          message: 'Product extras created successfully',
          errors: [],
          data: results,
        }
      }

      return {
        success: false,
        message: 'No product extras were created',
        errors: [],
        data: [],
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unexpected error',
        errors: [{ message: err instanceof Error ? err.message : 'Unexpected error' }],
        data: [],
      }
    }
  }
}
