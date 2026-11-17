import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { ConsoleLogger } from '../../../../shared/infrastructure/logger/console.logger'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { CreateProductCategoryUseCase } from '../../application/use-cases/create-product-category.use-case'
import { GetCatProductsWithProductUseCase } from '../../application/use-cases/get-all-category-with-products-category.usecase'
import { GetAllCategoryProductsUseCase } from '../../application/use-cases/get-all-products-category.use-case'
import { GetCategoryByNameProductsUseCase } from '../../application/use-cases/get-by-name-products-category.use-case'
import { GetOneCategoryProductsUseCase } from '../../application/use-cases/get-one-products-category.use-case'
import { GetPaginatedCategoryProductsUseCase } from '../../application/use-cases/get-paginated-category-products.use-case'
import { SequelizeCategoryProductRepository } from '../../infrastructure/repositories/sequelize-category-products.controller.repository'

const categoryProductsRepository = new SequelizeCategoryProductRepository(MigrationFolder.Public)
const name = '[CreateProductCategoryUseCase]'
const logger = new ConsoleLogger()
const createProductCategoryUseCase = new CreateProductCategoryUseCase(name, categoryProductsRepository, logger)
export const CategoryProductRepositoryServices = { create: createProductCategoryUseCase }

export const CategoryProductRepositoryServicesTenantFactory = (tenant: string) => {
  const repository = new SequelizeCategoryProductRepository(getTenantName(tenant))
  return {
    create: new CreateProductCategoryUseCase(name, repository, logger),
    getAll: new GetAllCategoryProductsUseCase(repository),
    getPaginated: new GetPaginatedCategoryProductsUseCase(repository),
    getByName: new GetCategoryByNameProductsUseCase(repository),
    getOne: new GetOneCategoryProductsUseCase(repository),
    getCatProductsWithProduct: new GetCatProductsWithProductUseCase(repository)
  }
}
