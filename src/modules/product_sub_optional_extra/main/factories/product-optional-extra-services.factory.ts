

import { UpdateProductSubOptionalUseCase } from '@modules/product_sub_optional_extra/application/use-cases/update-product-sub-optional-extra.usecase'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { SequelizeProductOptionalExtraRepository } from '../../../product_optional_extra/infrastructure/repositories/sequelize.controller.repository'
import { DeleteExtFoodSubsOptionalUseCase } from '../../application/use-cases/delete-product-sub-optional-extra.usecase'
import { CreateProductSubOptionalUseCase } from '../../application/use-cases/product-sub-optional-extra.usecase'
import { SequelizeProductSubOptionalExtraRepository } from '../../infrastructure/repositories/sequelize.controller.repository'

const productSubOptionalRepository =
  new SequelizeProductSubOptionalExtraRepository(MigrationFolder.Public)

const productOptionalRepository =
  new SequelizeProductOptionalExtraRepository(MigrationFolder.Public)

export const ProductSubOptionalServicesPublic = {
  create: new CreateProductSubOptionalUseCase(
    productSubOptionalRepository,
    productOptionalRepository
  ),

  update: new UpdateProductSubOptionalUseCase(
    productSubOptionalRepository
  )
}

export const ProductSubOptionalServicesTenantFactory = (tenant: string) => {
  const productSubOptionalRepository =
    new SequelizeProductSubOptionalExtraRepository(getTenantName(tenant))

  const productOptionalRepository =
    new SequelizeProductOptionalExtraRepository(getTenantName(tenant))

  return {
    create: new CreateProductSubOptionalUseCase(
      productSubOptionalRepository,
      productOptionalRepository
    ),

    delete: new DeleteExtFoodSubsOptionalUseCase(
      productSubOptionalRepository
    ),

    update: new UpdateProductSubOptionalUseCase(
      productSubOptionalRepository
    )
  }
}
