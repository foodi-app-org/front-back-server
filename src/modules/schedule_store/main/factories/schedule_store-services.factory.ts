
import { CreateScheduleStoreUseCase } from '../../application/use-cases/create-schedule-store.usecase'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { SequelizeScheduleStoreRepository } from '../../infrastructure/repositories/sequelize-store.controller.repository'
import { GetAllScheduleStoreUseCase } from '../../application/use-cases/get-all-schedule-store.usecase'

const userRepository = new SequelizeScheduleStoreRepository(MigrationFolder.Public)


export const ScheduleServicesPublic = {
    create: new CreateScheduleStoreUseCase(userRepository),
    getAll: new GetAllScheduleStoreUseCase(userRepository)
}

export const ScheduleServicesTenantFactory = (tenant: string) => {

    const userRepository = new SequelizeScheduleStoreRepository(getTenantName(tenant))
    const createScheduleStoreUseCase = new CreateScheduleStoreUseCase(userRepository)
    const getAllScheduleStoreUseCase = new GetAllScheduleStoreUseCase(userRepository)

    return {
        create: createScheduleStoreUseCase,
        getAll: getAllScheduleStoreUseCase
    }
}