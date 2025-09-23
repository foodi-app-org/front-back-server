import { StateProductExtra } from '../../domain/entities/product-optional-extra.entity'
import { IProductExtraRepo } from '../../domain/repositories/product-optional-extra.repository'


interface DeleteProductExtraInput {
    id: string
    state: StateProductExtra
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
export class DeleteProductExtraUseCase {
    constructor(
        private readonly repo: IProductExtraRepo
    ) { }

    async execute(input: DeleteProductExtraInput): Promise<DeleteProductUseCaseResponse | null> {
        try {

            const existing = await this.repo.findById(String(input.id))
            if (!existing) {
                return {
                    success: false, 
                    message: 'No existe el producto', 
                    data: null
                }
            }

            const active = StateProductExtra.ACTIVE

            const updated = await this.repo.update(String(existing.exPid), {
                updatedAt: new Date(),
                exState: input.state === active ? StateProductExtra.INACTIVE : active
            })

            if (!updated) {
                return {
                    success: false,
                    message: 'No se pudo actualizar el estado del producto',
                    data: null
                }
            }

            const message = input.state === active ? 'Producto Eliminado' : 'Producto Activado'

            return {
                success: true,
                message,
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
