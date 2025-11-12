import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { CreateIShoppingCartTypeUseCase } from '@modules/shopping/application/use-cases/find-shopping-by-code-ref-.usecase'
import { GetAllByCodeRefShoppingCartTypeUseCase } from '@modules/shopping/application/use-cases/get-all-shopping-by-code-ref-.usecase'
import { SequelizeShoppingCartRepository } from '@modules/shopping/infrastructure/repositories/sequelize.controller.repository'


export const ShoppingCartServicesPublic = {
    findCodeRef: new CreateIShoppingCartTypeUseCase(new SequelizeShoppingCartRepository(MigrationFolder.Public)),
    getAllByCodeRef: new GetAllByCodeRefShoppingCartTypeUseCase(new SequelizeShoppingCartRepository(MigrationFolder.Public))
}

export const ShoppingCartServicesTenantFactory = (tenant: string) => {
    const rolesRepository = new SequelizeShoppingCartRepository(getTenantName(tenant))
    return {
        getAllByRefCode: new GetAllByCodeRefShoppingCartTypeUseCase(rolesRepository),
        findCodeRef: new CreateIShoppingCartTypeUseCase(rolesRepository)
    }
}