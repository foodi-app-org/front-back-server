import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { ModuleServicesFactory } from '../../../infrastructure/services/'

export const modulesResolvers = {
  Query: {
    modules: async (_: GraphQLResolveInfo, _args: { id: string }, context: GraphQLContext) => {
      const services = ModuleServicesFactory(context?.restaurant ?? '')
      return await services.getAll.execute()
    }
  },
  Mutation: {
  }
}
