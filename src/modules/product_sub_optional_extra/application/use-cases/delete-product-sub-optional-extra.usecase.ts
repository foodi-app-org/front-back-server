import { StateProductSubOptionalExtra } from '../../domain/entities/product-sub-optional-extra.entity'
import { IProductSubOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'


interface DeleteProductOptionalInput {
    code: string
    state: StateProductSubOptionalExtra
    isCustomSubOpExPid?: boolean
}

export interface UseCaseResponse<T = unknown> {
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
            const code = String(input.code)
            const isCustom = Boolean(input.isCustomSubOpExPid)

            // When the item is a custom sub-option, the frontend sends the record's
            // opSubExPid; otherwise it sends the exCode. Look up accordingly.
            const existing = isCustom
                ? await this.repo.finByopSubExPid(code)
                : await this.repo.findByExCode(code)

            if (!existing) {
                return { success: false, message: 'No product exists with that code', data: null }
            }

            const active = StateProductSubOptionalExtra.ACTIVE
            const nextState = input.state === active
                ? StateProductSubOptionalExtra.INACTIVE
                : active

            const updated = isCustom
                ? await this.repo.updateByOpSubExPid(String(existing.opSubExPid), {
                    updatedAt: new Date(),
                    state: nextState
                })
                : await this.repo.updateByExCode(String(existing.exCode), {
                    updatedAt: new Date(),
                    state: nextState
                })

            const message = input.state === active ? 'Sub produto Elimnado' : 'Activated'

            return { success: true, message, data: updated }
        } catch (err) {
            return { success: false, message: err instanceof Error ? err.message : 'Unexpected error' }
        }
    }
}
