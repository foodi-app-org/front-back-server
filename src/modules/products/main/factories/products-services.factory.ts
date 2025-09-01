

import { CreateProductTypeUseCase } from '../../application/use-cases/create-products.usecase'
import { FindProductByIdUseCase } from '../../application/use-cases/find-products-by-id.usecase'
import { SequelizeProductRepository } from '../../infrastructure/repositories/sequelize.controller.repository'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { SequelizeCategoryProductRepository } from '../../../category_products/infrastructure/repositories/sequelize-category-products.controller.repository'

const productRepository = new SequelizeProductRepository(MigrationFolder.Public)
const categoryProductsRepository = new SequelizeCategoryProductRepository(MigrationFolder.Public)



export const ProductServices = {
    create: new CreateProductTypeUseCase(productRepository, categoryProductsRepository),
    findById: new FindProductByIdUseCase(productRepository),
}

export const ProductServicesTenantFactory = (tenant: string) => {
    const productRepository = new SequelizeProductRepository(getTenantName(tenant))
    const categoryProductsRepository = new SequelizeCategoryProductRepository(getTenantName(tenant))

    return {
        create: new CreateProductTypeUseCase(productRepository, categoryProductsRepository),
        findById: new FindProductByIdUseCase(productRepository)
    }
}
