import { IProductSubOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'

export interface UseCaseResponse<T = any> {
    success: boolean
    message: string
    data?: T | null
    errors?: { message: string; path?: string }[]
}

/**
 * Use case for creating or updating sub optional product extras
 */
export class GetAllProductSubOptionalUseCase {
    constructor(
        private readonly repo: IProductSubOptionalExtraRepo
    ) { }

    async execute(exCodeOptionExtra: string, idStore: string): Promise<UseCaseResponse> {
        try {
            // get all sub optional extras by extra code
            const optionalExtra = await this.repo.getAllByExtraCode(exCodeOptionExtra ?? '') ?? []

            return { success: true, message: 'Sub optional extras retrieved', data: optionalExtra }
        } catch (err) {
            return { success: false, message: err instanceof Error ? err.message : 'Unexpected error' }
        }
    }
}
