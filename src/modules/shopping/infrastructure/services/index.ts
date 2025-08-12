 
import { SequelizeProductRepository } from '../../../products/infrastructure/repositories/sequelize.controller.repository'
import { CreateIShoppingCartTypeUseCase } from '../../application/use-cases/create_shopping.usecase'
import { SequelizeStatusOrderRepository } from '../repositories/sequelize.controller.repository'

const shoppingRepository = new SequelizeStatusOrderRepository()
const productRepository = new SequelizeProductRepository()

export const ShoppingTypesServices = {
    create: new CreateIShoppingCartTypeUseCase(shoppingRepository, productRepository)
}