

import { UpdateProductOptionalUseCase } from '../../application/use-cases/product-optional-extra.usecase'
import { GetAllProductSubOptionalByProductIdUseCase } from '../../application/use-cases/get-all-product-optional-by-product-id.usecase'
import { DeleteExtProductFoodsOptionalUseCase } from '../../application/use-cases/delete-product-optional-extra.usecase'
import { SequelizeProductOptionalExtraRepository } from '../../infrastructure/repositories/sequelize.controller.repository'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

const productRepository = new SequelizeProductOptionalExtraRepository(MigrationFolder.Public)

export const ProductOptionalServicesPublic = {
    create: new UpdateProductOptionalUseCase(productRepository)
}

export const ProductOptionalServicesTenantFactory = (tenant: string) => {
    const productRepository = new SequelizeProductOptionalExtraRepository(getTenantName(tenant))

    return {
        create: new UpdateProductOptionalUseCase(productRepository),
        delete: new DeleteExtProductFoodsOptionalUseCase(productRepository),
        getAllProductOptionalByProductId: new GetAllProductSubOptionalByProductIdUseCase(productRepository),
    }
}
