import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { CreateStoreDTO } from '../../../application/use-cases/create-store.usecase'
import { StoreServicesPublic } from '../../../infrastructure/services'
import { CategoryStoreServicesPublic } from '../../../../category_store/main/factories/category_store.factory'
import { StoreServicesTenantFactory } from '../../../main/factories/store-services.factory'


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
      return await StoreServicesPublic.create.execute(args.input)
    },
    setScheduleOpenAll: async (_: GraphQLResolveInfo, args: { id: string, openAll: boolean }, context: GraphQLContext) => {
      const services = StoreServicesTenantFactory(context.restaurant ?? '')
      await services.updateScheduleOpenAll.execute(args.id, args.openAll)
      return {
        success: true,
        message: 'Schedule updated successfully',
        errors: null
      }
    }
  }
}
