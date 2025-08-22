import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { DashboardComponentsServicesFactory } from '../../../infrastructure/services'

export const modulesResolvers = {
  Query: {
    dashboardComponents: async (_: GraphQLResolveInfo, _args: { id: string }, context: GraphQLContext) => {
      const services = DashboardComponentsServicesFactory(context?.restaurant ?? '')
      return await services.getAll.execute()
    }
  },
  Mutation: {
  }
}
