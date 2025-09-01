import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { CreateStoreDTO } from '../../../application/use-cases/create-store.usecase'
import { StoreServicesPublic } from '../../../infrastructure/services'
import { CategoryStoreServicesPublic } from '../../../../category_store/main/factories/category_store.factory'


interface NewRegisterStoreArgs {
  input: CreateStoreDTO
}

export const storeResolvers = {
  Type: {
    Store: {
      cateStore: async (parent: any, _: any, context: GraphQLContext) => {
        return await CategoryStoreServicesPublic.findById.execute(parent.catStore ?? '')
      }
    }
  },
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
      console.log("🚀 ~ args.input:", args.input)
      return await StoreServicesPublic.create.execute(args.input)
    }
  }
}
