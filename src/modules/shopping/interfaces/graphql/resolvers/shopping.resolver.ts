import { GraphQLResolveInfo } from 'graphql'

import { ShoppingTypesServices } from '../../../infrastructure/services'
import { shoppingCartSchema } from '../../../infrastructure/validators'
import { CreateStatusTypeOrderInput } from '../inputs'

export const shoppingResolvers = {
  Query: {
   
  },
  Mutation: {
    registerShoppingCart: async (_: GraphQLResolveInfo, args: { input: CreateStatusTypeOrderInput }) => {
      const { error, value } = shoppingCartSchema.validate(args.input)
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
      return await ShoppingTypesServices.create.execute(value)
    }
  }
}
