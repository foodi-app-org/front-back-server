import { GraphQLResolveInfo } from 'graphql'
import { ProductExtraServicesTenantFactory } from '../../../main/factories/product-extra-services.factory'
import { productExtraSchema } from '../../../infrastructure/validators/product-extra.validator'
import { GraphQLContext } from '../../../../../shared/types/context'

type CreateStatusTypeOrderInput = {
  extraPrice: number,
  exState: number,
  extraName: string,
  pId: string
}

export const productExtraResolvers = {
  Query: {

  },
  Mutation: {
    updateMultipleExtProduct: async (
      _: GraphQLResolveInfo,
      args: { inputLineItems: { setData: CreateStatusTypeOrderInput[] } },
      context: GraphQLContext
    ) => {
      const values = args.inputLineItems.setData.map(item => ({
        ...item,
        idStore: context.restaurant ?? ''
      }))
      for (const val of values) {
        const { error } = productExtraSchema.validate(
          val,
          { abortEarly: false }
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

      const services = ProductExtraServicesTenantFactory(context.restaurant ?? '');
      const result = await services.create.execute(values, context.restaurant ?? '')
      if (result.success) {
        return {
          success: true,
          message: 'Product extras created successfully',
          data: Array.isArray(result.data) ? result.data : [],
        }
      }
      return {
        success: false,
        message: 'Failed to create product extras',
        errors: result.errors ?? [],
        data: [],
      }
    },
  },
}
