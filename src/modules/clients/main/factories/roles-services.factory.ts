
import { GetAllClientUseCase } from '@modules/clients/application/use-cases/get-all-clients.usecase'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { CreateClientUseCase } from '../../application/use-cases/clients.usecase'
import { SequelizeClientsRepository } from '../../infrastructure/repositories/sequelize.controller.repository'
import { FindClientUseCase } from '@modules/clients/application/use-cases/find-client.usecase'
import { FindClientByLegalIdUseCase } from '@modules/clients/application/use-cases/find-client-by-legal-id.usecase'

const clientsRepository = new SequelizeClientsRepository(MigrationFolder.Public)

export const ClientsServices = {
    create: new CreateClientUseCase(clientsRepository),
    getAll: new GetAllClientUseCase(clientsRepository),
    findById: new FindClientUseCase(clientsRepository),
    findByLegalId: new FindClientByLegalIdUseCase(clientsRepository)
}

export const ClientServicesTenantFactory = (tenant: string) => {
    const rolesRepository = new SequelizeClientsRepository(getTenantName(tenant))
    return {
        create: new CreateClientUseCase(rolesRepository),
        getAll: new GetAllClientUseCase(rolesRepository),
        findById: new FindClientUseCase(rolesRepository),
        findByLegalId: new FindClientByLegalIdUseCase(rolesRepository)
    }
}