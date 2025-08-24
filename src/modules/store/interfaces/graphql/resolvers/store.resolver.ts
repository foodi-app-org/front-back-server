import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { CreateStoreDTO } from '../../../application/use-cases/create-store.usecase'
import { StoreServicesPublic } from '../../../infrastructure/services'


interface NewRegisterStoreArgs {
  input: CreateStoreDTO
}

export const storeResolvers = {
  /**
   * Query to get store details by ID
   */
  Query: {
    getStore: async (_: GraphQLResolveInfo, args: { id: string }, context: GraphQLContext) => {
      return await StoreServicesPublic.findById.execute(args.id ??  context.restaurant ?? '')
    }
  },
  Mutation: {
    newRegisterStore: async (_: GraphQLResolveInfo, args: NewRegisterStoreArgs) => {
      return await StoreServicesPublic.create.execute(args.input)
    }
  }
}
