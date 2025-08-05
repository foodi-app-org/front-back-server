import { GraphQLResolveInfo } from 'graphql'

import { SequelizeUserRepository } from '../../../../user/infrastructure/repositories/sequelize-user.controller.repository'
import { CreateStoreDTO, CreateStoreUseCase } from '../../../application/use-cases/create-store.usecase'
import { SequelizeStoreRepository } from '../../../infrastructure/repositories/sequelize-store.controller.repository'

const userRepository = new SequelizeUserRepository()
const storeRepository = new SequelizeStoreRepository()


const createStoreUseCase = new CreateStoreUseCase(storeRepository, userRepository)

interface NewRegisterStoreArgs {
  input: CreateStoreDTO
}

export const storeResolvers = {
  Query: {

  },
  Mutation: {
    newRegisterStore: async (_: GraphQLResolveInfo, args: NewRegisterStoreArgs) => {
      return await createStoreUseCase.execute(args.input)
    }
  }
}
