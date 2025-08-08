import { CreateScheduleStoreUseCase } from '../../application/use-cases/create-schedule-store.usecase'
import { SequelizeScheduleStoreRepository } from '../repositories/sequelize-store.controller.repository'

const categoryStoreRepository = new SequelizeScheduleStoreRepository()

export const ScheduleStoreServices = {
    create: new CreateScheduleStoreUseCase(categoryStoreRepository) 
}