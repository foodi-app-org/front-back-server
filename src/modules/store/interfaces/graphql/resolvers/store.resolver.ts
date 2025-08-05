import { GraphQLResolveInfo } from 'graphql'

import { CreateStoreDTO } from '../../../application/use-cases/create-store.usecase'
import { StoreServices } from '../../../infrastructure/services'


interface NewRegisterStoreArgs {
  input: CreateStoreDTO
}

export const storeResolvers = {
  Query: {

  },
  Mutation: {
    newRegisterStore: async (_: GraphQLResolveInfo, args: NewRegisterStoreArgs) => {
      return await StoreServices.create.execute(args.input)
    }
  }
}
