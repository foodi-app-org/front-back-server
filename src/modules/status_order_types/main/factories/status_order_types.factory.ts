 
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils' 
import { CreateStatusOrderTypeUseCase } from '../../application/use-cases/create_status_order_types.usecase'
import { GetAllStatusOrderTypeUseCase } from '../../application/use-cases/getAll_status_order_types.usecase copy'
import { FindByNameStatusOrderTypeUseCase } from '../../application/use-cases/find_by_name_status_order_types.usecase'
import { SequelizeStatusOrderTypesRepository } from '../../infrastructure/repositories/sequelize-store.controller.repository'
import { FindByIdStatusOrderTypeUseCase } from '@modules/status_order_types/application/use-cases/find_by_id_status_order_types.usecase'

const statusOrderTypesRepository = new SequelizeStatusOrderTypesRepository(MigrationFolder.Public)

export const StatusOrderTypesServicesPublic = {
    create: new CreateStatusOrderTypeUseCase(statusOrderTypesRepository),
    getAll: new GetAllStatusOrderTypeUseCase(statusOrderTypesRepository),
    findByName: new FindByNameStatusOrderTypeUseCase(statusOrderTypesRepository)
}

export const StatusOrderTypesServicesTenantFactory = (tenant: string) => {
    const statusOrderTypesRepository = new SequelizeStatusOrderTypesRepository(getTenantName(tenant))
    return {
        create: new CreateStatusOrderTypeUseCase(statusOrderTypesRepository),
        getAll: new GetAllStatusOrderTypeUseCase(statusOrderTypesRepository),
        findByName: new FindByNameStatusOrderTypeUseCase(statusOrderTypesRepository),
        findById: new FindByIdStatusOrderTypeUseCase(statusOrderTypesRepository)
    }
}