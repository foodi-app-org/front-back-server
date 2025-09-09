import { IProductSubOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
import { StateProductSubOptionalExtra } from '../../domain/entities/product-sub-optional-extra.entity'


interface DeleteProductOptionalInput {
    code: string
    state: StateProductSubOptionalExtra
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
export class DeleteExtFoodSubsOptionalUseCase {
    constructor(
        private readonly repo: IProductSubOptionalExtraRepo
    ) { }

    async execute(input: DeleteProductOptionalInput): Promise<UseCaseResponse> {
        try {

            const existing = await this.repo.findByExCode(String(input.code))
            console.log("🚀 ~ DeleteExtFoodSubsOptionalUseCase ~ execute ~ existing:", existing)
            if (!existing) {
                return { success: false, message: 'No product exists with that code', data: null }
            }

            const active = StateProductSubOptionalExtra.ACTIVE

            const updated = await this.repo.updateByExCode(String(existing.exCode), {
                updatedAt: new Date(),
                state: input.state === active ? StateProductSubOptionalExtra.INACTIVE : active
            })

            const message = input.state === active ? 'Deleted' : 'Activated'

            return { success: true, message, data: updated }
        } catch (err) {
            return { success: false, message: err instanceof Error ? err.message : 'Unexpected error' }
        }
    }
}
