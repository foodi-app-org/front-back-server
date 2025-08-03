import { GraphQLResolveInfo } from 'graphql'

import { CreateStoreDTO, CreateStoreUseCase } from '../../../application/use-cases/create-store.usecase'
import { SequelizeStoreRepository } from '../../../infrastructure/repositories/sequelize-store.controller.repository'

const userRepository = new SequelizeStoreRepository()

const createStoreUseCase = new CreateStoreUseCase(userRepository)

interface NewRegisterStoreArgs {
  input: CreateStoreDTO
}

export const storeResolvers = {
  Query: {

  },
  Mutation: {
    newRegisterStore: async (_: GraphQLResolveInfo, args: NewRegisterStoreArgs) => {
      const { input } = args
      return await createStoreUseCase.execute(input)
    }
  }
}
