 
import { CreateStatusOrderTypeUseCase } from '../../application/use-cases/create_status_order.usecase'
import { SequelizeStatusOrderRepository } from '../repositories/sequelize.controller.repository'

const statusOrderTypesRepository = new SequelizeStatusOrderRepository()

export const StatusOrderTypesServices = {
    create: new CreateStatusOrderTypeUseCase(statusOrderTypesRepository)
}