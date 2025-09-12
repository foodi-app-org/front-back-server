import { IProductExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
import { StateProductExtra } from '../../domain/entities/product-optional-extra.entity'


interface DeleteProductExtraInput {
    code: string
    state: StateProductExtra
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
export class DeleteProductExtraUseCase {
    constructor(
        private readonly repo: IProductExtraRepo
    ) { }

    async execute(input: DeleteProductExtraInput): Promise<void> {
        // try {

        //     const existing = await this.repo.findByCode(String(input.code))
        //     if (!existing) {
        //         return { success: false, message: 'No existe un producto con ese código', data: null }
        //     }

        //     const active = StateProductExtra.ACTIVE

        //     const updated = await this.repo.updateByCode(String(existing.code), {
        //         updatedAt: new Date(),
        //         state: input.state === active ? StateProductExtra.INACTIVE : active
        //     })

        //     const message = input.state === active ? 'Eliminado' : 'Activado'

        //     return { success: true, message, data: updated }
        // } catch (err) {
        //     return { success: false, message: err instanceof Error ? err.message : 'Unexpected error' }
        // }
    }
}
