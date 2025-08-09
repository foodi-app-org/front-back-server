import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { StatusOrderTypesServices } from '../../../infrastructure/services'
import { statusOrderTypeSchema } from '../../../infrastructure/validators/index'
import { CreateStatusTypeOrderInput } from '../inputs'

export const statusOrderTypesResolvers = {
  Query: {
    getAllOrderStatusTypes: async (_: GraphQLResolveInfo, _args: unknown, context: GraphQLContext) => {
      const { restaurant: idStore } = context
      return await StatusOrderTypesServices.getAll.execute(idStore ?? '')
    }
  },
  Mutation: {
    createOrderStatusType: async (_: GraphQLResolveInfo, args: { data: CreateStatusTypeOrderInput }) => {
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
      return await StatusOrderTypesServices.create.execute(value)
    }
  }
}
