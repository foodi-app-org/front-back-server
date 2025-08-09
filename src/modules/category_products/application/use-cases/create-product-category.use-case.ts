import { Logger } from '../../../../shared/domain/logger'
import { I18nAdapter } from '../../../../shared/i18n/i18n.adapter'
import { ProductCategory, ProductCategoryProps } from '../../domain/entities/category_products.entity'
import { CategoryProductRepository } from '../../domain/repositories/category_products.repository'


/**
 * Output DTO after creating a category
 */
export interface CreateProductCategoryResponse {
    success: boolean
    message: string
    category?: ProductCategory
}

/**
 * Use case responsible for creating a new Product Category
 */
export class CreateProductCategoryUseCase {
    constructor(
        private readonly name = 'CreateProductCategoryUseCase',
        private readonly categoryProductRepository: CategoryProductRepository,
        private readonly i18n: I18nAdapter,
        private readonly logger: Logger
    ) { }

    /**
     * Executes the use case to create a new Product Category
     * @param input - Category data
     * @returns Success status and created category (if successful)
     */
    async execute(data: ProductCategoryProps): Promise<CreateProductCategoryResponse> {
        const { 
            idStore,
            carProId,
            pName,
            ProDescription,
         } = data


        const category = new ProductCategory({
            idStore,
            carProId,
            pName,
            ProDescription,
        })

        try {
           await this.categoryProductRepository.create(category)
           this.logger.success(`${this.name} ✅ Category created: ${pName}`)
            return {
                success: true,
                message: 'Categoría creada exitosamente',
            }
        } catch (error) {
            this.logger.error(`'❌ Error creating product category:', ${error}`)
            return {
                success: false,
                message: 'Error al crear la categoría',
                // message: this.i18n.t('category.create.error'),
            }
        }
    }
}
