import { IProductExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
import { ProductExtra } from '../../domain/entities/product-optional-extra.entity'
import { Transaction } from 'sequelize'


export interface InputProductExtraInput {
    exPid: string
    extraName: string,
    extraPrice: number,
    pId: string,
    idStore: string,
    pCodeRef: string,
    quantity: number
}

interface DeleteProductUseCaseResponse {
    success: boolean
    message: string
    data?: ProductExtra[] | null
    errors?: { message: string; path?: string }[]
}


/**
 * Use case for creating or updating optional product extras
 */
export class BulkInsertProductExtraUseCase {
    constructor(
        private readonly repo: IProductExtraRepo
    ) { }

    async execute(input: InputProductExtraInput[], transaction: Transaction): Promise<DeleteProductUseCaseResponse | null> {
        try {

            const created = await this.repo.bulkInsert(input, transaction)

            return {
                success: true,
                message: 'data extra createdos correctamente',
                data: created
            }
        } catch (err) {
            return {
                success: false,
                message: err instanceof Error ? err.message : 'Unexpected error',
                data: null
            }
        }
    }
}
