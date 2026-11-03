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
 * Use case for creating or updating product categories
 */
export class UpdateProductOptionalUseCase {
  constructor(
    private readonly repo: IProductOptionalExtraRepo
  ) {}

  async execute(
    input: UpdateProductOptionalInput,
    idStore: string
  ): Promise<UseCaseResponse> {
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

      // The admin UI sends `opExPid` equal to the short `code` for both create
      // and update. To tell them apart we look up an existing record by `code`:
      // if none exists we create, otherwise we update. This keeps creation
      // working even when `opExPid` is already populated by the client.
      const existing = input.code
        ? await this.repo.findByCode(String(input.code))
        : null

      if (!existing) {
        const created = await this.repo.create(entity)

        return {
          success: true,
          message: 'La categoría de productos se ha creado correctamente',
          data: created
        }
      }

      // Update by `code` (the value we just matched on) rather than `opExPid`,
      // since the stored primary key may differ from the short client code.
      const updated = await this.repo.updateByCode(
        existing.code,
        {
          OptionalProName: input.OptionalProName,
          numbersOptionalOnly: input.numbersOptionalOnly,
          required: input.required,
          updatedAt: new Date()
        }
      )

      return {
        success: true,
        message: 'La categoría de productos se ha actualizado correctamente',
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