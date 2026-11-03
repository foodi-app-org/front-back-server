import { StateProductOptionalExtra } from '../../domain/entities/product-optional-extra.entity'
import { IProductOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'

interface DeleteProductOptionalInput {
  code: string
  state: StateProductOptionalExtra
}

export interface UseCaseResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: { message: string; path?: string }[]
}

/**
 * Use case for activating or deactivating product categories
 */
export class DeleteExtProductFoodsOptionalUseCase {
  constructor(
    private readonly repo: IProductOptionalExtraRepo
  ) {}

  async execute(
    input: DeleteProductOptionalInput
  ): Promise<UseCaseResponse> {
    try {
      const existing = await this.repo.findByCode(
        String(input.code)
      )

      if (!existing) {
        return {
          success: false,
          message: 'No existe una categoría de productos con ese código',
          data: null
        }
      }

      const active = StateProductOptionalExtra.ACTIVE

      const isActive = input.state === active

      const updated = await this.repo.updateByCode(
        String(existing.code),
        {
          updatedAt: new Date(),
          state: isActive
            ? StateProductOptionalExtra.INACTIVE
            : active
        }
      )

      const message = isActive
        ? 'La categoría de productos se ha eliminado correctamente'
        : 'La categoría de productos se ha activado correctamente'

      return {
        success: true,
        message,
        data: updated
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error
          ? err.message
          : 'Ha ocurrido un error inesperado'
      }
    }
  }
}