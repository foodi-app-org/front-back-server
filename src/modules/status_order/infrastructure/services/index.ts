 
import { CreateStatusOrderTypeUseCase } from '../../application/use-cases/create_status_order.usecase'
import { SequelizeStatusOrderRepository } from '../repositories/sequelize.controller.repository'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

const statusOrderTypesRepository = new SequelizeStatusOrderRepository(MigrationFolder.Public)

export const StatusOrderServices = {
    create: new CreateStatusOrderTypeUseCase(statusOrderTypesRepository)
}

export const StatusOrderServicesTenantFactory = (tenant: string) => {
    const statusOrderTypesRepository = new SequelizeStatusOrderRepository(getTenantName(tenant))
    return {
        create: new CreateStatusOrderTypeUseCase(statusOrderTypesRepository)
    }
}