 

import { SequelizeCategoryProductRepository } from '../../../category_products/infrastructure/repositories/sequelize-category-products.controller.repository'
import { CreateProductTypeUseCase } from '../../application/use-cases/create-products.usecase'
import { FindProductByIdUseCase } from '../../application/use-cases/find-products-by-id.usecase'
import { SequelizeProductRepository } from '../repositories/sequelize.controller.repository'

const productRepository = new SequelizeProductRepository()
const categoryProductRepository = new SequelizeCategoryProductRepository()

export const ProductServices = {
  create: new CreateProductTypeUseCase(productRepository, categoryProductRepository),
  findById: new FindProductByIdUseCase(productRepository)
}