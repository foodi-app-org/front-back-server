

import { UpdateProductOptionalUseCase } from '../../application/use-cases/product-optional-extra.usecase'
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
    }
}
