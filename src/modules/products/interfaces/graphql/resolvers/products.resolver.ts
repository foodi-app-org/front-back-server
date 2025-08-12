import { GraphQLResolveInfo } from 'graphql'

import { ProductServices } from '../../../infrastructure/services'
import { productSchema } from '../../../infrastructure/validators'
import { CreateStatusTypeOrderInput } from '../inputs'

export const productResolvers = {
  Query: {
   
  },
  Mutation: {
    updateProductFoods: async (_: GraphQLResolveInfo, args: { input: CreateStatusTypeOrderInput }) => {
      const { error, value } = productSchema.validate(args.input)
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
      return await ProductServices.create.execute(value)
    }
  }
}
