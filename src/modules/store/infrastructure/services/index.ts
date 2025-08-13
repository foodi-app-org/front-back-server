import { I18nAdapter } from '../../../../shared/i18n/i18n.adapter'
import { SequelizeMigrationService } from '../../../../shared/infrastructure/db/sequelize/migrations/services/SequelizeMigrationService'
import { SequelizeUserRepository } from '../../../user/infrastructure/repositories/sequelize-user.controller.repository'
import { CreateStoreUseCase } from '../../application/use-cases/create-store.usecase'
import { FindStoreUseCase } from '../../application/use-cases/find-by-id-store.usecase'
import { SequelizeStoreRepository } from '../repositories/sequelize-store.controller.repository'

const userRepository = new SequelizeUserRepository()
const storeRepository = new SequelizeStoreRepository()
const migrationService = new SequelizeMigrationService()
const i18n = new I18nAdapter('es', 'store')

const createStoreUseCase = new CreateStoreUseCase(
    storeRepository, 
    userRepository,
    migrationService,
    i18n
)

const findByIdStoreUseCase = new FindStoreUseCase(storeRepository)

export const StoreServices = {
    create: createStoreUseCase,
    findById: findByIdStoreUseCase
}