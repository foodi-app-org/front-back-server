import { IProductSubOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
import { ProductSubOptionalExtra, StateProductSubOptionalExtra } from '../../domain/entities/product-sub-optional-extra.entity'
import { IProductOptionalExtraRepo } from '../../../product_optional_extra/domain/repositories/product-optional-extra.repository'



export type UpdateProductSubOptionalInput = Partial<ProductSubOptionalExtra>

export interface UseCaseResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: { message: string; path?: string }[]
}

/**
 * Use case for creating or updating sub optional product extras
 */
export class UpdateProductSubOptionalUseCase {
  constructor(
    private readonly repo: IProductSubOptionalExtraRepo,
    private readonly productOptionalRepo: IProductOptionalExtraRepo
  ) { }

  async execute(input: UpdateProductSubOptionalInput, idStore: string): Promise<UseCaseResponse> {
    try {
      const entity = new ProductSubOptionalExtra({
        exCode: input.exCode ?? '',
        exCodeOptionExtra: input.exCodeOptionExtra ?? '',
        OptionalSubProName: input.OptionalSubProName ?? '',
        pId: input.pId ?? '',
        idStore: idStore,
        state: StateProductSubOptionalExtra.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // verify limit of sub optional extras for the given optional extra
      const optionalExtra = await this.productOptionalRepo.findByCode(input.exCodeOptionExtra ?? '')

      const getAllSubOptionals = await this.repo.getAllByExtraCode(input.exCodeOptionExtra ?? '') ?? []

      if (optionalExtra && optionalExtra.numbersOptionalOnly <= getAllSubOptionals.length) {
        const message = `El extra opcional  ${optionalExtra.OptionalProName ?? ''} ya tiene el número máximo de sub extras (${optionalExtra.numbersOptionalOnly}) permitidos.`
        return {
          success: false,
          message,
          data: null
        }
      }

      const created = await this.repo.create(entity)

      return { success: true, message: 'Sub optional extra created', data: created }
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Unexpected error' }
    }
  }
}
