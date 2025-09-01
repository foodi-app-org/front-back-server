import { CreateCategoryStoreUseCase } from '../../application/use-cases/create-category_store.usecase'
import { FindAllCategoryStoreUseCase } from '../../application/use-cases/get-all-category_store.usecase'
import { SequelizeCategoryStoreRepository } from '../repositories/sequelize-user.controller.repository'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { FindByIdCategoryStoreByIdUseCase } from '../../application/use-cases/get-by-id-category_store.usecase'

const categoryStoreRepository = new SequelizeCategoryStoreRepository(MigrationFolder.Public)

export const Services = {
    create: new CreateCategoryStoreUseCase(categoryStoreRepository),
    findById: new FindByIdCategoryStoreByIdUseCase(categoryStoreRepository),
    getAll: new FindAllCategoryStoreUseCase(categoryStoreRepository)
}