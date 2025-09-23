import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { ModuleServicesFactory, SubmoduleServicesFactory } from '../../../infrastructure/services/'

export const modulesResolvers = {
  Type: {
    Module: {
      subModules: async (parent: { dataValues: { mId: string } }, _args: Record<string, unknown>, context: GraphQLContext) => {
        const services = SubmoduleServicesFactory(context?.restaurant ?? '')
        return await services.getAll.execute(parent.dataValues.mId)
      }
    }
  },
  Query: {
    modules: async (_: GraphQLResolveInfo, _args: { id: string }, context: GraphQLContext) => {

      const services = ModuleServicesFactory(context?.restaurant ?? '')
      return await services.getAll.execute()
    }
  },
  Mutation: {
  }
}
