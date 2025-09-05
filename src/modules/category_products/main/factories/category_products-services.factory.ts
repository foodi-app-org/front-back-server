import { ConsoleLogger } from '../../../../shared/infrastructure/logger/console.logger'
import { I18nAdapter } from '../../../../shared/i18n/i18n.adapter'
import { CreateProductCategoryUseCase } from '../../application/use-cases/create-product-category.use-case'
import { GetAllCategoryProductsUseCase } from '../../application/use-cases/get-all-products-category.use-case'
import { GetCatProductsWithProductUseCase } from '../../application/use-cases/get-all-category-with-products-category.usecase'
import { GetCategoryByNameProductsUseCase } from '../../application/use-cases/get-by-name-products-category.use-case'
import { SequelizeCategoryProductRepository } from '../../infrastructure/repositories/sequelize-category-products.controller.repository'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

const categoryProductsRepository = new SequelizeCategoryProductRepository(MigrationFolder.Public)
const name = '[CreateProductCategoryUseCase]'

const i18n = new I18nAdapter('es', 'category_products')
const logger = new ConsoleLogger()
const createProductCategoryUseCase = new CreateProductCategoryUseCase(
    name,
    categoryProductsRepository,
    i18n,
    logger
)

export const CategoryProductRepositoryServices = {
    create: createProductCategoryUseCase
}

export const CategoryProductRepositoryServicesTenantFactory = (tenant: string) => {
    const categoryProductsRepository = new SequelizeCategoryProductRepository(getTenantName(tenant))
    const name = '[CreateProductCategoryUseCase]'
    const i18n = new I18nAdapter('es', 'category_products')
    const logger = new ConsoleLogger()
    const createProductCategoryUseCase = new CreateProductCategoryUseCase(
        name,
        categoryProductsRepository,
        i18n,
        logger
    )

    return {
        create: createProductCategoryUseCase,
        getAll: new GetAllCategoryProductsUseCase(categoryProductsRepository),
        getByName: new GetCategoryByNameProductsUseCase(categoryProductsRepository),
        getCatProductsWithProduct: new GetCatProductsWithProductUseCase(categoryProductsRepository)
    }
}