
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { SequelizeProductRepository } from '../../../products/infrastructure/repositories/sequelize.controller.repository'
import { CreateIShoppingCartTypeUseCase } from '../../application/use-cases/create_shopping.usecase'
import { SumPriceShoppingCartUseCase } from '../../application/use-cases/sum-price-shopping.usecase'
import { SequelizeShoppingCartRepository } from '../repositories/sequelize.controller.repository'

const shoppingRepository = new SequelizeShoppingCartRepository()
const productRepository = new SequelizeProductRepository()

export const ShoppingTypesServices = {
    create: new CreateIShoppingCartTypeUseCase(shoppingRepository, productRepository),
    sumPrice: new SumPriceShoppingCartUseCase(shoppingRepository)
}

export const ShoppingServicesTenantFactory = (tenant: string) => {
    const shoppingRepository = new SequelizeShoppingCartRepository(getTenantName(tenant))
    const productRepository = new SequelizeProductRepository(getTenantName(tenant))

    return {
        create: new CreateIShoppingCartTypeUseCase(shoppingRepository, productRepository),
        sumPrice: new SumPriceShoppingCartUseCase(shoppingRepository)
    }
}