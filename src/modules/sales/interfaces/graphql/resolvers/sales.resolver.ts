
import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { SalesServicesFactory } from '../../../infrastructure/services'

export const salesResolvers = {
  Query: {
    getTodaySales: async (_: GraphQLResolveInfo, __: any, context: GraphQLContext) => {
      const services = SalesServicesFactory(context?.restaurant ?? '')
      return services.getSalesCount.execute(new Date(), new Date()) ?? 0
    },
    getSalesAmountToday: async (_: GraphQLResolveInfo, __: any, context: GraphQLContext) => {
      const services = SalesServicesFactory(context?.restaurant ?? '')
      const total = await services.getSalesAmountToday.execute(new Date(), new Date())
      console.log('🚀 ~ total:', total)
      return {
        success: true,
        total: 0,
        message: 'Sales amount retrieved successfully'
      }
    }
  },
  Mutation: {
  }
}
