
import { RoleUseCase } from '../../application/use-cases/roles.usecase'
import { SequelizeRolesRepository } from '../repositories/sequelize.controller.repository'

const shoppingRepository = new SequelizeRolesRepository()

export const ShoppingTypesServices = {
    create: new RoleUseCase(shoppingRepository),
    findById: new RoleUseCase(shoppingRepository)
}
