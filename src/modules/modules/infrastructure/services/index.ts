
import { CreateModuleUseCase } from '../../application/use-cases/create-modules.usecase'
import { CreateSubmoduleUseCase } from '../../application/use-cases/create-sub-modules.usecase'
import { SequelizeModuleOrderRepository } from '../repositories/sequelize.controller.repository'
import { SequelizeSubModuleOrderRepository } from '../repositories/sequelize.sub-module.controller.repository'

const moduleRepository = new SequelizeModuleOrderRepository()
const submoduleRepository = new SequelizeSubModuleOrderRepository()

export const ModuleServices = {
    create: new CreateModuleUseCase(moduleRepository),
}

export const SubmoduleServices = {
    create: new CreateSubmoduleUseCase(submoduleRepository)
}