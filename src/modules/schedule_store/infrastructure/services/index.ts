import { CreateScheduleStoreUseCase } from '../../application/use-cases/create-schedule-store.usecase'
import { SequelizeScheduleStoreRepository } from '../repositories/sequelize-store.controller.repository'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'


const categoryStoreRepository = new SequelizeScheduleStoreRepository(MigrationFolder.Public)

export const ScheduleStoreServices = {
    create: new CreateScheduleStoreUseCase(categoryStoreRepository) 
}