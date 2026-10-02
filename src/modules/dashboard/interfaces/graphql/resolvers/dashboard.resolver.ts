import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { DashboardComponentCreateInput } from '../../../domain/repositories/dashboard-components.repository'
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
    },
    getLocalBackendIp: async (_: GraphQLResolveInfo, _args: { id: string }, context: GraphQLContext) => {
      const services = DashboardComponentsServicesFactory(context?.restaurant ?? '')
      return await services.getLocalBackendIp.execute()
    }
  },
  Mutation: {
    createDashboardComponent: async (_: GraphQLResolveInfo, { input }: { input: DashboardComponentCreateInput }, context: GraphQLContext) => {
      const services = DashboardComponentsServicesFactory(context?.restaurant ?? '')
      const created = await services.create.execute(input)
      return {
        success: Boolean(created),
        message: created ? 'Dashboard component created' : 'Dashboard component not created',
        id: created?.id,
        data: created ?? null,
        errors: []
      }
    },
    updateDashboardComponent: async (_: GraphQLResolveInfo, { input }: { input: [DashboardComponentUpdateInput] }, context: GraphQLContext) => {
      const services = DashboardComponentsServicesFactory(context?.restaurant ?? '')
      return await services.update.execute(input)
    },
    deleteDashboardComponent: async (_: GraphQLResolveInfo, { id }: { id: string }, context: GraphQLContext) => {
      const services = DashboardComponentsServicesFactory(context?.restaurant ?? '')
      const result = await services.delete.execute(id)
      return {
        success: result.success,
        message: result.message,
        id: result.id ?? id,
        data: null,
        errors: []
      }
    }
  }
}
