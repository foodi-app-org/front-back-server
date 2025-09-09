

import { UpdateProductSubOptionalUseCase } from '../../application/use-cases/product-sub-optional-extra.usecase'
import { DeleteExtFoodSubsOptionalUseCase } from '../../application/use-cases/delete-product-sub-optional-extra.usecase'
import { SequelizeProductSubOptionalExtraRepository } from '../../infrastructure/repositories/sequelize.controller.repository'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

const productSubOptionalRepository = new SequelizeProductSubOptionalExtraRepository(MigrationFolder.Public)

export const ProductSubOptionalServicesPublic = {
    create: new UpdateProductSubOptionalUseCase(productSubOptionalRepository)
}

export const ProductSubOptionalServicesTenantFactory = (tenant: string) => {
    const productSubOptionalRepository = new SequelizeProductSubOptionalExtraRepository(getTenantName(tenant))
    return {
        create: new UpdateProductSubOptionalUseCase(productSubOptionalRepository),
        delete: new DeleteExtFoodSubsOptionalUseCase(productSubOptionalRepository)
    }
}
