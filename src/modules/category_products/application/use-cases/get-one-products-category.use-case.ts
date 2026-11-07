import { ProductCategory } from '../../domain/entities/category_products.entity'
import { CategoryProductRepository } from '../../domain/repositories/category_products.repository'

/**
 * Use case responsible for retrieving a single Product Category by its id
 * (`carProId`). Used to validate that a category exists before associating it
 * with a product.
 */
export class GetOneCategoryProductsUseCase {
    constructor(
        private readonly categoryProductRepository: CategoryProductRepository
    ) { }

    /**
     * Executes the lookup.
     * @param carProId - Category identifier.
     * @returns The category or null when it does not exist / on error.
     */
    async execute(carProId: string): Promise<ProductCategory | null> {
        try {
            if (!carProId) return null
            const category = await this.categoryProductRepository.findById(carProId)
            return category
        } catch (error) {
            console.error('Error in GetOneCategoryProductsUseCase:', error)
            return null
        }
    }
}
