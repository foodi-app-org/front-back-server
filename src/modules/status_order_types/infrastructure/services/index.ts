 
import { CreateStatusOrderTypeUseCase } from '../../application/use-cases/create_status_order_types.usecase'
import { GetAllStatusOrderTypeUseCase } from '../../application/use-cases/getAll_status_order_types.usecase copy'
import { SequelizeStatusOrderTypesRepository } from '../repositories/sequelize-store.controller.repository'

const statusOrderTypesRepository = new SequelizeStatusOrderTypesRepository()

export const StatusOrderTypesServices = {
    create: new CreateStatusOrderTypeUseCase(statusOrderTypesRepository),
    getAll: new GetAllStatusOrderTypeUseCase(statusOrderTypesRepository)
}