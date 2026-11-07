import { ProductExtra } from '../../domain/entities/product-optional-extra.entity'
import { IProductExtraRepo } from '../../domain/repositories/product-optional-extra.repository'

export type UpdateProductExtraInput = Partial<ProductExtra>

export interface UseCaseResponse<T = any> {
    success: boolean
    message: string
    data?: T | null
    errors?: { message: string; path?: string }[]
}

/**
 * Use case for creating or updating optional product extras
 */
export class GetAllExtraProduct {
    constructor(
        private readonly repo: IProductExtraRepo
    ) { }


    async execute(id: string): Promise<UseCaseResponse> {
        try {
            const data = await this.repo.getAllByProductId(id)
            if (data) {
                return {
                    success: true,
                    message: 'Product extras retrieved successfully',
                    data: data
                }
            }
            return {
                success: false,
                message: 'No product extras found',
                data: []
            }
        } catch (err) {
            return {
                success: false,
                message: err instanceof Error ? err.message : 'Unexpected error',
                errors: [{ message: err instanceof Error ? err.message : 'Unexpected error' }],
                data: []
            }
        }
    }
}

/**
 * Use case: lista todos los complementos (extras) de la tienda que se manejan
 * por inventario y tienen existencias (`manageStock = true`, `stock > 0`).
 * Alimenta la vista "Unidades en inventario" del panel.
 */
export class GetExtrasInStock {
    constructor(
        private readonly repo: IProductExtraRepo
    ) { }

    async execute(): Promise<UseCaseResponse<ProductExtra[]>> {
        try {
            const data = await this.repo.getAllInStockByStore()
            return {
                success: true,
                message: 'Extras in stock retrieved successfully',
                data: data ?? []
            }
        } catch (err) {
            return {
                success: false,
                message: err instanceof Error ? err.message : 'Unexpected error',
                errors: [{ message: err instanceof Error ? err.message : 'Unexpected error' }],
                data: []
            }
        }
    }
}
