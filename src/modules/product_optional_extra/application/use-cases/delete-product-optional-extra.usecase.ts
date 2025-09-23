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
 * Use case for creating or updating optional product extras
 */
export class DeleteExtProductFoodsOptionalUseCase {
    constructor(
        private readonly repo: IProductOptionalExtraRepo
    ) { }

    async execute(input: DeleteProductOptionalInput): Promise<UseCaseResponse> {
        try {

            const existing = await this.repo.findByCode(String(input.code))
            if (!existing) {
                return { success: false, message: 'No existe un producto con ese código', data: null }
            }
            
            const active = StateProductOptionalExtra.ACTIVE

            const updated = await this.repo.updateByCode(String(existing.code), {
                updatedAt: new Date(),
                state: input.state === active ? StateProductOptionalExtra.INACTIVE : active
            })

            const message = input.state === active ? 'Eliminado' : 'Activado'

            return { success: true, message, data: updated }
        } catch (err) {
            return { success: false, message: err instanceof Error ? err.message : 'Unexpected error' }
        }
    }
}
