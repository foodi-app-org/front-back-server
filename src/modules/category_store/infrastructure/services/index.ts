import { CreateCategoryStoreUseCase } from '../../application/use-cases/create-category_store.usecase'
import { SequelizeCategoryStoreRepository } from '../repositories/sequelize-user.controller.repository'

const categoryStoreRepository = new SequelizeCategoryStoreRepository()

export const Services = {
    create: new CreateCategoryStoreUseCase(categoryStoreRepository) 
}