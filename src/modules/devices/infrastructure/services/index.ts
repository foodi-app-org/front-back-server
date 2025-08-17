import { CreateDeviceUseCase } from '../../application/use-cases/create-devices-store.usecase'
import { SequelizeStoreRepository } from '../repositories/sequelize-device-store.controller.repository'

const storeRepository = new SequelizeStoreRepository()

const createStoreUseCase = new CreateDeviceUseCase(
    storeRepository, 
)
export const StoreServices = {
    create: createStoreUseCase
}