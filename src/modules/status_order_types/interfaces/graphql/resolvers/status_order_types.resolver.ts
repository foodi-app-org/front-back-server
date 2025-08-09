import { GraphQLResolveInfo } from 'graphql'

import { StatusOrderTypesServices } from '../../../infrastructure/services'
import { statusOrderTypeSchema } from '../../../infrastructure/validators/index'
import { CreateStatusTypeOrderInput } from '../inputs'

export const statusOrderTypesResolvers = {
  Query: {
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
