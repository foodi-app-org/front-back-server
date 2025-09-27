import { Transaction } from 'sequelize'
import { ProductOptionalExtra } from '../../domain/entities/product-optional-extra.entity'
import { IProductOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'

export type UpdateProductOptionalAndSubOptionalInput = Partial<ProductOptionalExtra> & {
  ExtProductFoodsSubOptionalAll?: Array<{
    pId: string
    opExPid: string | null
    idStore: string
    opSubExPid: string
    OptionalSubProName: string
    exCodeOptionExtra: string
    exCode: string
    state: number
    createdAt: string
    updatedAt: string
    check: boolean
  }>
}

export interface UseCaseResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: { message: string; path?: string }[]
}


/**
 * Use case for creating or updating optional product extras
 */
export class BulkCreateProductOptionalAndSubOptionalUseCase {
  constructor(
    private readonly repo: IProductOptionalExtraRepo
  ) {}

  async execute(dataOptional: UpdateProductOptionalAndSubOptionalInput[], transaction: Transaction): Promise<UseCaseResponse> {
    try {

      console.log("🚀 ~ BulkCreateProductOptionalAndSubOptionalUseCase ~ execute ~ input:", dataOptional)
      await this.repo.bulkCreateOrUpdateProductOptionalAndSubOptional(dataOptional, transaction)

      return { success: true, message: 'Actualizado' }
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Unexpected error' }
    }
  }
}
