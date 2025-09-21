import { IProductOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'

export interface UseCaseResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: { message: string; path?: string }[]
}


/**
 * Use case for creating or updating optional product extras
 */
export class GetAllProductSubOptionalByProductIdUseCase {
  constructor(
    private readonly repo: IProductOptionalExtraRepo
  ) {}

  async execute(pId: string): Promise<UseCaseResponse> {
    try {

      const updated = await this.repo.getAllProductOptionalByProductId(pId)

      return {
        success: true,
        message: 'Product optional extras retrieved successfully',
        data: updated
      }
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Unexpected error' }
    }
  }
}
