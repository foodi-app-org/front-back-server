import { SequelizeMigrationService } from '../../../../infrastructure/db/sequelize/migrations/services/SequelizeMigrationService'
import { SequelizeUserRepository } from '../../../user/infrastructure/repositories/sequelize-user.controller.repository'
import { CreateStoreUseCase } from '../../application/use-cases/create-store.usecase'
import { SequelizeStoreRepository } from '../repositories/sequelize-store.controller.repository'

const userRepository = new SequelizeUserRepository()
const storeRepository = new SequelizeStoreRepository()
const migrationService = new SequelizeMigrationService()

const createStoreUseCase = new CreateStoreUseCase(
    storeRepository, 
    userRepository,
    migrationService
)

export const StoreServices = {
    create: createStoreUseCase
}