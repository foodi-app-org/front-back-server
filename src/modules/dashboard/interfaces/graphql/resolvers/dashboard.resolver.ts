import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { DashboardComponentsServicesFactory } from '../../../infrastructure/services'
export interface DashboardComponentUpdateInput {
  id: string
  name?: string
  title?: string
  coordinates: {
    x: number
    y: number
    w: number
    h: number
  }
}

//  updateDashboardComponent(input: [DashboardComponentUpdateInput]): ResponseDashboardComponent!
export const dashboardResolvers = {
  Query: {
    dashboardComponents: async (_: GraphQLResolveInfo, _args: { id: string }, context: GraphQLContext) => {
      const services = DashboardComponentsServicesFactory(context?.restaurant ?? '')
      return await services.getAll.execute()
    }
  },
  Mutation: {
    updateDashboardComponent: async (_: GraphQLResolveInfo, { input }: { input: [DashboardComponentUpdateInput] }, context: GraphQLContext) => {
      const services = DashboardComponentsServicesFactory(context?.restaurant ?? '')
      return await services.update.execute(input)
    }
  }
}
