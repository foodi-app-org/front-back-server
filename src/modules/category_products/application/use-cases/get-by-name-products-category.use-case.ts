import { ProductCategory } from '../../domain/entities/category_products.entity'
import { CategoryProductRepository } from '../../domain/repositories/category_products.repository'

/**
 * Use case responsible for creating a new Product Category
 */
export class GetCategoryByNameProductsUseCase {
    constructor(
        private readonly categoryProductRepository: CategoryProductRepository,
    ) { }

    async execute(name: string): Promise<ProductCategory | null> {

        try {
            const category = await this.categoryProductRepository.getByName(name)
            return category
        } catch (error) {
            console.error('Error in GetAllCategoryProductsUseCase:', error);
            return null
        }
    }
}
