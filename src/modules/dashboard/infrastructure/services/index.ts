

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { GetAllDashboardComponentsUseCase } from '../../application/use-cases/create-dashboard-components.usecase'
import { UpdateDashboardComponentsUseCase } from '../../application/use-cases/update-dashboard-components.usecase'
import { SequelizeDashboardComponentsRepository } from '../repositories/sequelize.controller.repository'

const dashboardComponentsRepository = new SequelizeDashboardComponentsRepository(MigrationFolder.Public)

export const DashboardComponentsServicesPublic = {
    getAll: new GetAllDashboardComponentsUseCase(dashboardComponentsRepository)
}


export const DashboardComponentsServicesFactory = (tenant: string) => {
    const moduleRepository = new SequelizeDashboardComponentsRepository(getTenantName(tenant))

    return {
        getAll: new GetAllDashboardComponentsUseCase(moduleRepository),
        update: new UpdateDashboardComponentsUseCase(moduleRepository)
    }
}