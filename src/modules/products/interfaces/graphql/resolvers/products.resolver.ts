import { GraphQLResolveInfo } from 'graphql'

import { productSchema } from '../../../infrastructure/validators'
import { CreateStatusTypeOrderInput } from '../inputs'
import { GraphQLContext } from '../../../../../shared/types/context'
import { ProductServicesTenantFactory } from '../../../main/factories/products-services.factory'

export const productResolvers = {
  Query: {
   
  },
  Mutation: {
    updateProductFoods: async (_: GraphQLResolveInfo, args: { input: CreateStatusTypeOrderInput }, context: GraphQLContext) => {
      const values = { ...args.input }
      const { error, value } = productSchema.validate({
        ...values,
        idStore: context.restaurant ?? ''
      })
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
      const services = ProductServicesTenantFactory(context.restaurant ?? '')
      return await services.create.execute(value)
    }
  }
}
