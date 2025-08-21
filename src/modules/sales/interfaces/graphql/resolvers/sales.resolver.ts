
import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { SalesServicesFactory } from '../../../infrastructure/services'

export const salesResolvers = {
  Query: {
    getTodaySales: async (_: GraphQLResolveInfo, __: any, context: GraphQLContext) => {
      const services = SalesServicesFactory(context?.restaurant ?? '')
      return services.getSalesCount.execute(new Date(), new Date()) ?? 0
    }
  },
  Mutation: {
  }
}
