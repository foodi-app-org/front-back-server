import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { statusOrderTypeSchema } from '../../../infrastructure/validators/index'
import { CreateStatusTypeOrderInput } from '../inputs'
import { StatusOrderTypesServicesTenantFactory } from '@modules/status_order_types/main/factories/status_order_types.factory'

export const statusOrderTypesResolvers = {
  Query: {
    getAllOrderStatusTypes: async (_: GraphQLResolveInfo, _args: unknown, context: GraphQLContext) => {
      const { restaurant: idStore } = context
      const services = StatusOrderTypesServicesTenantFactory(idStore ?? '')
      return await services.getAll.execute(idStore ?? '')
    }
  },
  Mutation: {
    createOrderStatusType: async (_: GraphQLResolveInfo, args: { data: CreateStatusTypeOrderInput },  context: GraphQLContext) => {
      const { error, value } = statusOrderTypeSchema.validate(args.data)
      if (error) {
        return {
          success: false,
          data: null,
          message: 'Error de validación',
          errors: error?.details.map(e => ({
            message: e.message,
            path: e.path,
            type: e.type,
            context: e.context
          }))
        }
      }
      const { restaurant: idStore } = context

      const services = StatusOrderTypesServicesTenantFactory(idStore ?? '')
      return await services.create.execute(value)
    }
  }
}
