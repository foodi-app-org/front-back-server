import { IProductExtraRepo } from '../../domain/repositories/product-optional-extra.repository'


interface DeleteProductExtraInput {
    exPid: string
    extraName: string,
    extraPrice: number
}

interface DeleteProductUseCaseResponse<T = any> {
    success: boolean
    message: string
    data?: T | null
    errors?: { message: string; path?: string }[]
}


/**
 * Use case for creating or updating optional product extras
 */
export class UpdateProductOptionalUseCase {
    constructor(
        private readonly repo: IProductExtraRepo
    ) { }

    async execute(input: DeleteProductExtraInput): Promise<DeleteProductUseCaseResponse | null> {
        try {

            const existing = await this.repo.findById(String(input.exPid))
            if (!existing) {
                return {
                    success: false,
                    message: 'No existe el producto',
                    data: null
                }
            }

            const updated = await this.repo.update(String(existing.exPid), {
                updatedAt: new Date(),
                extraName: String(input.extraName),
                extraPrice: input.extraPrice
            })

            if (!updated) {
                return {
                    success: false,
                    message: 'No se pudo actualizar el producto',
                    data: null
                }
            }


            return {
                success: true,
                message: 'Producto actualizado correctamente',
                data: updated
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
