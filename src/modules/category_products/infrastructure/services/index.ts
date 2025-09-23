import { I18nAdapter } from '../../../../shared/i18n/i18n.adapter'
import { ConsoleLogger } from '../../../../shared/infrastructure/logger/console.logger'
import { CreateProductCategoryUseCase } from '../../application/use-cases/create-product-category.use-case'
import { SequelizeCategoryProductRepository } from '../repositories/sequelize-category-products.controller.repository'


const userRepository = new SequelizeCategoryProductRepository()
const name = '[CreateProductCategoryUseCase]'

const i18n = new I18nAdapter('es', 'category_products')
const logger = new ConsoleLogger()
const createProductCategoryUseCase = new CreateProductCategoryUseCase(
    name,
    userRepository,
    i18n,
    logger
)

export const CategoryProductRepositoryServices = {
    create: createProductCategoryUseCase
}