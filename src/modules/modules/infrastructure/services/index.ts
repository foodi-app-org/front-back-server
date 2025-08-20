
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { CreateModuleUseCase } from '../../application/use-cases/create-modules.usecase'
import { CreateSubmoduleUseCase } from '../../application/use-cases/create-sub-modules.usecase'
import { GetAllModulesUseCase } from '../../application/use-cases/get-all-modules.usecase'
import { SequelizeModuleOrderRepository } from '../repositories/sequelize.controller.repository'
import { SequelizeSubModuleOrderRepository } from '../repositories/sequelize.sub-module.controller.repository'

const moduleRepository = new SequelizeModuleOrderRepository(MigrationFolder.Public)
const submoduleRepository = new SequelizeSubModuleOrderRepository(MigrationFolder.Public)

export const ModuleServicesPublic = {
    create: new CreateModuleUseCase(moduleRepository),
    getAll: new GetAllModulesUseCase(moduleRepository),
}

export const SubmoduleServicesPublic = {
    create: new CreateSubmoduleUseCase(submoduleRepository)
}


export const ModuleServicesFactory = (tenant: string) => {
  const moduleRepository = new SequelizeModuleOrderRepository(getTenantName(tenant))

  return {
    create: new CreateModuleUseCase(moduleRepository),
    getAll: new GetAllModulesUseCase(moduleRepository),
  }
}