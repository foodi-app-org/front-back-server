 

import { CreateProductTypeUseCase } from '../../application/use-cases/create-products.usecase'
import { FindProductByIdUseCase } from '../../application/use-cases/find-products-by-id.usecase'
import { SequelizeProductRepository } from '../repositories/sequelize.controller.repository'

const productRepository = new SequelizeProductRepository()

export const ProductServices = {
  create: new CreateProductTypeUseCase(productRepository),
  findById: new FindProductByIdUseCase(productRepository)
}