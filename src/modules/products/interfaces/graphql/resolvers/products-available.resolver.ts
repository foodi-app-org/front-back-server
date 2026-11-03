import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { availableProductSchema } from '../../../infrastructure/validators'
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
      const idStore = context.restaurant ?? ''

      if (!idStore) {
        return {
          success: false,
          data: null,
          message: 'Store ID is required',
          errors: [{ message: 'Store ID is required', path: ['idStore'] }]
        }
      }

      const services = ProductServicesTenantFactory(idStore)
      const mappedInput = args.input.map(item => ({
        ...item,
        idStore,
        startDate: item.startDate ?? '00:00',
        endDate: item.endDate ?? '23:59',
        state: 1
      }))
      return await services.registerAvailableProduct.execute(mappedInput)
    }
  }
}
