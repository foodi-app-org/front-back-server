import { CreateDeviceUseCase } from '../../application/use-cases/create-devices-store.usecase'
import { SequelizeDeviceStoreRepository } from '../repositories/sequelize-device-store.controller.repository'

const deviceStoreRepository = new SequelizeDeviceStoreRepository()

const createDeviceUseCase = new CreateDeviceUseCase(
    deviceStoreRepository, 
)
export const DeviceStoreServicesPublic = {
    create: createDeviceUseCase
}