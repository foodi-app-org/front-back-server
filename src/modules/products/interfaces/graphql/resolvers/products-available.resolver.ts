import { GraphQLResolveInfo } from 'graphql'

import { availableProductSchema } from '../../../infrastructure/validators'
import { GraphQLContext } from '../../../../../shared/types/context'
import { ProductServicesTenantFactory } from '../../../main/factories/products-services.factory'

export type AvailableProduct = {
  idStore: string;
  pId: string;
  dayAvailable: number;
  startDate: string;
  endDate: string;
  state: number;
};

export const productAvailableResolvers = {
  Query: {

  },
  Mutation: {
    registerAvailableProduct: async (_: GraphQLResolveInfo, args: { input: AvailableProduct[] }, context: GraphQLContext) => {

      // Validate all inputs
      for (const available of args.input) {
        const values = { ...available }
        const { error } = availableProductSchema.validate({
          ...values,
          idStore: context.restaurant ?? ''
        }, { abortEarly: false }
        )
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
      }
      const services = ProductServicesTenantFactory(context.restaurant ?? '')
      const mappedInput = args.input.map(item => ({
        ...item,
        startDate: item.startDate,
        endDate: item.endDate,
        state: 1
      }))
      return await services.registerAvailableProduct.execute(mappedInput)
    },
  }
}
