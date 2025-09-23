import { ProductOptionalExtra } from '../../domain/entities/product-optional-extra.entity'
import { IProductOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'



export type UpdateProductOptionalInput = Partial<ProductOptionalExtra>

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
    private readonly repo: IProductOptionalExtraRepo
  ) {}

  async execute(input: UpdateProductOptionalInput, idStore: string): Promise<UseCaseResponse> {
    try {
      const entity = new ProductOptionalExtra({
        opExPid: input.opExPid,
        pId: input.pId ?? '',
        OptionalProName: input.OptionalProName ?? '',
        numbersOptionalOnly: input.numbersOptionalOnly ?? 0,
        code: input.code ?? '',
        required: input.required ?? 0,
        idStore
      })

      if (!input.opExPid) {
        const created = await this.repo.create(entity)
        return { success: true, message: 'Creado', data: created }
      }

      const existing = await this.repo.findByCode(String(input.code))
      if (!existing) {
        return { success: false, message: 'No existe un producto con ese código', data: null }
      }

      const updated = await this.repo.update(existing.code, {
        OptionalProName: input.OptionalProName,
        numbersOptionalOnly: input.numbersOptionalOnly,
        required: input.required,
        createdAt: new Date()
      })

      return { success: true, message: 'Actualizado', data: updated }
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Unexpected error' }
    }
  }
}
