

import { UpdateProductOptionalUseCase } from '../../application/use-cases/product-extra.usecase'
// import { DeleteExtProductExtraUseCase } from '../../application/use-cases/delete-product-extra.usecase'
import { SequelizeProductExtraRepository } from '../../infrastructure/repositories/sequelize.controller.repository'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

const productRepository = new SequelizeProductExtraRepository(MigrationFolder.Public)

export const ProductOptionalServicesPublic = {
    create: new UpdateProductOptionalUseCase(productRepository),
    // delete: new DeleteExtProductExtraUseCase(productRepository),
}

export const ProductExtraServicesTenantFactory = (tenant: string) => {
    const productRepository = new SequelizeProductExtraRepository(getTenantName(tenant))

    return {
        create: new UpdateProductOptionalUseCase(productRepository),
        // delete: new DeleteExtProductExtraUseCase(productRepository),
    }
}
