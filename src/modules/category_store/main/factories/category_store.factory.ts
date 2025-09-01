import { CreateCategoryStoreUseCase } from '../../application/use-cases/create-category_store.usecase'
import { FindByIdCategoryStoreByIdUseCase } from '../../application/use-cases/get-by-id-category_store.usecase'
import { SequelizeCategoryStoreRepository } from '../../infrastructure/repositories/sequelize-user.controller.repository'

import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

const categoryStoreRepository = new SequelizeCategoryStoreRepository(MigrationFolder.Public)

export const CategoryStoreServicesPublic = {
    create: new CreateCategoryStoreUseCase(categoryStoreRepository),
    findById: new FindByIdCategoryStoreByIdUseCase(categoryStoreRepository)
}

export const CategoryStoreServicesTenantFactory = (tenant: string) => {
    const categoryStoreRepository = new SequelizeCategoryStoreRepository(getTenantName(tenant))
    return {
        create: new CreateCategoryStoreUseCase(categoryStoreRepository),
        findById: new FindByIdCategoryStoreByIdUseCase(categoryStoreRepository)
    }
}
