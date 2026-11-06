import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { TagsServicesTenantFactory } from '../../../main/factories/store-services.factory'

interface ITagInput {
  tgId?: string
  idUser?: string
  idStore?: string
  pId?: string
  state?: number
  nameTag?: string
  aName?: string
}

export const tagsResolvers = {
  Query: {
    getAllTags: async (_info: GraphQLResolveInfo, _args: {}, context: GraphQLContext) => {
      if (!context.restaurant) {
        throw new Error('Restaurant is required in context')
      }
      const services = TagsServicesTenantFactory(context.restaurant)
      return services.getAll.execute(context.restaurant)
    },
    getOneTags: async (
      _info: GraphQLResolveInfo,
      args: { tgId?: string; nameTag?: string; idStore?: string },
      context: GraphQLContext
    ) => {
      if (!context.restaurant) {
        throw new Error('Restaurant is required in context')
      }
      const services = TagsServicesTenantFactory(context.restaurant)
      return services.getOne.execute({
        idStore: context.restaurant,
        tgId: args?.tgId,
        nameTag: args?.nameTag
      })
    }
  },
  Mutation: {
    registerTag: async (
      _info: GraphQLResolveInfo,
      { input }: { input: ITagInput },
      context: GraphQLContext
    ) => {
      if (!context.restaurant) {
        throw new Error('Restaurant is required in context')
      }
      const services = TagsServicesTenantFactory(context.restaurant)
      return services.create.execute(
        {
          tgId: input?.tgId,
          idUser: input?.idUser ?? null,
          idStore: input?.idStore ?? null,
          nameTag: input?.nameTag ?? '',
          state: input?.state
        },
        context.restaurant
      )
    },
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
