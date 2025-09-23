
import { CreateClientUseCase } from '../../application/use-cases/clients.usecase'
import { GetAllClientUseCase } from '../../application/use-cases/get-all-clients.usecase'
import { SequelizeClientsRepository } from '../repositories/sequelize.controller.repository'

const clientsRepository = new SequelizeClientsRepository()

export const ClientsServices = {
    create: new CreateClientUseCase(clientsRepository),
    getAll: new GetAllClientUseCase(clientsRepository)
}