import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { CreateStoreDTO } from '../../../application/use-cases/create-store.usecase'
import { StoreServices } from '../../../infrastructure/services'


interface NewRegisterStoreArgs {
  input: CreateStoreDTO
}

export const storeResolvers = {
  /**
   * Query to get store details by ID
   */
  Query: {
    getStore: async (_: GraphQLResolveInfo, args: { id: string }, context: GraphQLContext) => {
      return await StoreServices.findById.execute(args.id ??  context.restaurant ?? '')
    }
  },
  Mutation: {
    newRegisterStore: async (_: GraphQLResolveInfo, args: NewRegisterStoreArgs) => {
      return await StoreServices.create.execute(args.input)
    }
  }
}
