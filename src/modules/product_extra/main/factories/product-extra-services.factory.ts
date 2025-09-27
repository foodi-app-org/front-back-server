

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { DeleteProductExtraUseCase } from '../../application/use-cases/delete-product-extra.usecase'
import { GetAllExtraProduct } from '../../application/use-cases/get-all-product-extra.usecase'
import { CreateProductOptionalUseCase } from '../../application/use-cases/product-extra.usecase'
import { UpdateProductOptionalUseCase } from '../../application/use-cases/update-product-extra.usecase'
import { BulkInsertProductExtraUseCase } from '../../application/use-cases/bulk-insert-product-extra.usecase'
import { SequelizeProductExtraRepository } from '../../infrastructure/repositories/sequelize.controller.repository'

const productRepository = new SequelizeProductExtraRepository(MigrationFolder.Public)

export const ProductOptionalServicesPublic = {
    create: new CreateProductOptionalUseCase(productRepository),
    getAllByProductId: new GetAllExtraProduct(productRepository)
}

export const ProductExtraServicesTenantFactory = (tenant: string) => {
    const productRepository = new SequelizeProductExtraRepository(getTenantName(tenant))

    return {
        create: new CreateProductOptionalUseCase(productRepository),
        getAllByProductId: new GetAllExtraProduct(productRepository),
        delete: new DeleteProductExtraUseCase(productRepository),
        update: new UpdateProductOptionalUseCase(productRepository),
        bulkCreateExtraSold: new BulkInsertProductExtraUseCase(productRepository)
    }
}
