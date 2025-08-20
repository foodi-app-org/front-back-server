
import { CreateClientUseCase } from '../../application/use-cases/clients.usecase'
import { SequelizeClientsRepository } from '../repositories/sequelize.controller.repository'

const shoppingRepository = new SequelizeClientsRepository()

export const ShoppingTypesServices = {
    create: new CreateClientUseCase(shoppingRepository),
}