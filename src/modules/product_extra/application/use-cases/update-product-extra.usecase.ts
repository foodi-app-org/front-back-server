import { IProductExtraRepo } from '../../domain/repositories/product-optional-extra.repository'


interface DeleteProductExtraInput {
    exPid: string
    extraName: string,
    extraPrice: number
    manageStock?: boolean
    stock?: number
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

            // Base catalog fields always updated.
            const patch: Record<string, unknown> = {
                updatedAt: new Date(),
                extraName: String(input.extraName),
                extraPrice: input.extraPrice
            }

            // manageStock is a catalog flag; persist it when provided so an
            // operator can enable/disable inventory control for the complement.
            const manageStockProvided = input.manageStock !== undefined
            if (manageStockProvided) {
                patch.manageStock = Boolean(input.manageStock)
            }

            // Stock is NOT written here directly. When the complement manages
            // stock and a target `stock` is provided, the caller (resolver)
            // applies the change via the inventory service so the stock column
            // and the kardex (stock_history) stay consistent with exactly one
            // movement. We only compute and surface the previous/target values.
            const previousStock = Number(existing.stock ?? 0)
            const willManageStock = manageStockProvided
                ? Boolean(input.manageStock)
                : Boolean(existing.manageStock)
            const targetStock = input.stock !== undefined ? Number(input.stock) : undefined

            const updated = await this.repo.update(String(existing.exPid), patch)

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
                data: updated,
                // Inventory hint for the caller to apply the stock movement.
                stockChange: {
                    exPid: String(existing.exPid),
                    manageStock: willManageStock,
                    previousStock,
                    targetStock
                }
            } as DeleteProductUseCaseResponse & { stockChange: unknown }
        } catch (err) {
            return {
                success: false,
                message: err instanceof Error ? err.message : 'Unexpected error',
                data: null
            }
        }
    }
}
