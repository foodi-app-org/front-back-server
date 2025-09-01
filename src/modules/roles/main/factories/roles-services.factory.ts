
import { RoleUseCase } from '../../application/use-cases/roles.usecase'
import { SequelizeRolesRepository } from '../../infrastructure/repositories/sequelize.controller.repository'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'

const rolesRepository = new SequelizeRolesRepository(MigrationFolder.Public)

export const RolesServices = {
    create: new RoleUseCase(rolesRepository),
    findById: new RoleUseCase(rolesRepository),
}

export const RolesServicesTenantFactory = (tenant: string) => {
    const rolesRepository = new SequelizeRolesRepository(getTenantName(tenant))
    return {
        create: new RoleUseCase(rolesRepository),
        findById: new RoleUseCase(rolesRepository),
    }
}