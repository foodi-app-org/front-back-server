import { GraphQLResolveInfo } from 'graphql'

import { CreateCategoryStoreUseCase } from '../../../application/use-cases/create-category_store.usecase';
import { SequelizeCategoryStoreRepository } from '../../../infrastructure/repositories/sequelize-user.controller.repository'
import { CreateCategoryStoreInput } from '../inputs'

const categoryStoreRepository = new SequelizeCategoryStoreRepository()

const createCategoryStoreUseCase = new CreateCategoryStoreUseCase(categoryStoreRepository)

export const categoryStoreResolvers = {
  Query: {
  },
  Mutation: {
    registerCategoryStore: async (_: GraphQLResolveInfo, args: { input: CreateCategoryStoreInput }) => {
      return await createCategoryStoreUseCase.execute(args.input)
    }
  }
}
