import { ProductCategory } from '../../domain/entities/category_products.entity'
import { CategoryProductRepository } from '../../domain/repositories/category_products.repository'


/**
 * Output DTO after creating a category
 */
export interface CreateProductCategoryResponse {
    success: boolean
    message: string
    data?: ProductCategory[]
}

/**
 * Use case responsible for creating a new Product Category
 */
export class GetAllCategoryProductsUseCase {
    constructor(
        private readonly categoryProductRepository: CategoryProductRepository,
    ) { }

    async execute(): Promise<CreateProductCategoryResponse> {

        try {
            const categories = await this.categoryProductRepository.getAll()
            return {
                success: true,
                message: 'Categorías obtenidas exitosamente',
                data: categories ?? []
            }
        } catch (error) {
            console.error('Error in GetAllCategoryProductsUseCase:', error);
            return {
                success: false,
                message: 'Error al obtener las categorías',
            }
        }
    }
}
