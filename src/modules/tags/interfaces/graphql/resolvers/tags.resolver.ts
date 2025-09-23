import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { TagsServicesTenantFactory } from '../../../main/factories/store-services.factory'

export const tagsResolvers = {
  Query: {
    getAllTags: async (_info: GraphQLResolveInfo, _args: {}, context: GraphQLContext) => {
      if (!context.restaurant) {
        throw new Error('Restaurant is required in context')
      }
      const services = TagsServicesTenantFactory(context.restaurant)
      return services.getAll.execute(context.restaurant)
    }
  },
  Mutation: {
    registerMultipleTags: async (_info: GraphQLResolveInfo, { input }: { input: string[] }, context: GraphQLContext) => {
      if (!context.restaurant) {
        throw new Error('Restaurant is required in context')
      }
      const services = TagsServicesTenantFactory(context.restaurant)
      return services.registerMultiple.execute(input, context.restaurant)
    },
    deleteOneTag: async (
      _info: GraphQLResolveInfo,
      args: { tgId?: string; nameTag?: string },
      context: GraphQLContext
    ) => {
      if (!context.restaurant) {
        throw new Error('Restaurant is required in context')
      }

      const services = TagsServicesTenantFactory(context.restaurant)

      // El caso de uso espera tgId, nameTag e idStore (aquí tu restaurant funciona como idStore/tenant)
      return services.delete.execute({
        ...args,
        idStore: context.restaurant
      })
    }
  }
}
