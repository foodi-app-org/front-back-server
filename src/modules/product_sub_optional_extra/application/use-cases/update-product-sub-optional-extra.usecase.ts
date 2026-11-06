import { ProductSubOptionalExtra } from '../../domain/entities/product-sub-optional-extra.entity'
import { IProductSubOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'

export interface InputUpdateProductSubOptionalUseCase {
  opSubExPid: string
  OptionalSubProName?: string
  isCustomSubOpExPid?: boolean
  exCodeOptionExtra?: string
}

export interface UseCaseResponse<T = any> {
  success: boolean
  message: string
  data?: T | null
  errors?: { message: string; path?: string }[]
}

/**
 * Use case for updating sub optional product extras.
 */
export class UpdateProductSubOptionalUseCase {
  constructor(
    private readonly repo: IProductSubOptionalExtraRepo,
  ) {}

  async execute(
    input: InputUpdateProductSubOptionalUseCase,
    _idStore: string
  ): Promise<UseCaseResponse<ProductSubOptionalExtra>> {
    try {
      const { opSubExPid, isCustomSubOpExPid } = input
      if (!opSubExPid) {
        return {
          success: false,
          message: 'El identificador del subextra es obligatorio.',
          data: null
        }
      }

      // Locate the existing sub optional extra.
      const current = isCustomSubOpExPid ?  await this.repo.findByCode(opSubExPid) : await this.repo.finByopSubExPid(opSubExPid)
      console.log(current)
      if (!current) {
        return {
          success: false,
          message: 'No se encontró el subextra que deseas actualizar.',
          data: null
        }
      }
    

      const updated = isCustomSubOpExPid 
      ? await this.repo.updateByExCode(String(current.exCode), input) 
      : await this.repo.updateByOpSubExPid(String(current.opSubExPid), input) 

      if (!updated) {
        return {
          success: false,
          message: 'No fue posible actualizar el subextra.',
          data: null
        }
      }

      return {
        success: true,
        message: 'Subextra actualizado correctamente.',
        data: updated
      }
    } catch (err) {
      console.log(err)
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unexpected error',
        data: null
      }
    }
  }
}