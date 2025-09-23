

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { SequelizeProductOptionalExtraRepository } from '../../../product_optional_extra/infrastructure/repositories/sequelize.controller.repository'
import { DeleteExtFoodSubsOptionalUseCase } from '../../application/use-cases/delete-product-sub-optional-extra.usecase'
import { UpdateProductSubOptionalUseCase } from '../../application/use-cases/product-sub-optional-extra.usecase'
import { SequelizeProductSubOptionalExtraRepository } from '../../infrastructure/repositories/sequelize.controller.repository'

const productSubOptionalRepository = new SequelizeProductSubOptionalExtraRepository(MigrationFolder.Public)
const productOptionalRepository = new SequelizeProductOptionalExtraRepository(MigrationFolder.Public)

export const ProductSubOptionalServicesPublic = {
    create: new UpdateProductSubOptionalUseCase(productSubOptionalRepository, productOptionalRepository)
}

export const ProductSubOptionalServicesTenantFactory = (tenant: string) => {
    const productSubOptionalRepository = new SequelizeProductSubOptionalExtraRepository(getTenantName(tenant))
    const productOptionalRepository = new SequelizeProductOptionalExtraRepository(getTenantName(tenant))

    return {
        create: new UpdateProductSubOptionalUseCase(productSubOptionalRepository, productOptionalRepository),
        delete: new DeleteExtFoodSubsOptionalUseCase(productSubOptionalRepository)
    }
}
