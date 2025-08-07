import { I18nAdapter } from '../../../../shared/i18n/i18n.adapter'
import { CreateProductCategoryUseCase } from '../../application/use-cases/create-product-category.use-case'
import { SequelizeCategoryProductRepository } from '../repositories/sequelize-store.controller.repository'

const userRepository = new SequelizeCategoryProductRepository()
const i18n = new I18nAdapter('es', 'category_products')

const createProductCategoryUseCase = new CreateProductCategoryUseCase(
    userRepository,
    i18n
)

export const CategoryProductRepositoryServices = {
    create: createProductCategoryUseCase
}