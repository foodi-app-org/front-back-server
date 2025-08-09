import { CreateStatusOrderTypeUseCase } from '../../application/use-cases/create_status_order_types.usecase'
import { SequelizeStatusOrderTypesRepository } from '../repositories/sequelize-store.controller.repository'

const categoryStoreRepository = new SequelizeStatusOrderTypesRepository()

export const StatusOrderTypesServices = {
    create: new CreateStatusOrderTypeUseCase(categoryStoreRepository) 
}