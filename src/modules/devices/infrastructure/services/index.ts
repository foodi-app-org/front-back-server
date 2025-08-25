
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { CreateDeviceUseCase } from '../../application/use-cases/create-devices-store.usecase'
import { FindDeviceByDeviceIdUseCase } from '../../application/use-cases/find-by-deviceId-devices-store.usecase'
import { GetAllDevicesUseCase } from '../../application/use-cases/get-all-devices-store.usecase'
import { SequelizeDeviceStoreRepository } from '../repositories/sequelize-device-store.controller.repository'

const deviceStoreRepository = new SequelizeDeviceStoreRepository(MigrationFolder.Public)

const createDeviceUseCase = new CreateDeviceUseCase(
    deviceStoreRepository, 
)

export const DeviceStoreServicesPublic = {
    create: createDeviceUseCase
}

export const DeviceServicesFactory = (tenant: string) => {
    const deviceRepository = new SequelizeDeviceStoreRepository(getTenantName(tenant))

    return {
        create: new CreateDeviceUseCase(deviceRepository),
        getAll: new GetAllDevicesUseCase(deviceRepository),
        findByDeviceId: new FindDeviceByDeviceIdUseCase(deviceRepository),
    }
}
