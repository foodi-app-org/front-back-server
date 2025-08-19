
import { CreateTagsUseCase } from '../../application/use-cases/create_tags.usecase'
import { SequelizeTagsRepository } from '../repositories/sequelize.controller.repository'

const shoppingRepository = new SequelizeTagsRepository()

export const ShoppingTypesServices = {
    create: new CreateTagsUseCase(shoppingRepository)
}