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
    ExtProductFoodsAll: async (_: GraphQLResolveInfo, args: { pId: string }, context: GraphQLContext) => {
      const { pId } = args ?? {
        pId: ''
      }
      try {
        const services = ProductExtraServicesTenantFactory(context.restaurant ?? '')
        const result = await services.getAllByProductId.execute(pId)
        const { data } = result ?? {
          data: null
        }
        return data
      } catch (err) {
        console.error(err)
        return null
      }
    },
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
          success: result.success,
          message: result.message,
          data: Array.isArray(result.data) ? result.data : [],
        }
      }
      return {
        success: result.success,
        message: result.message,
        errors: result.errors ?? [],
        data: [],
      }
    },
    deleteExtraProduct: async (
      _: GraphQLResolveInfo,
      args: { id: string, state: number },
      context: GraphQLContext
    ) => {
      const { id, state } = args ?? {
        id: '',
        state: null
      }
      try {
        const services = ProductExtraServicesTenantFactory(context.restaurant ?? '')
        return await services.delete.execute({ id, state })
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Unexpected error',
          data: null,
        }
      }
    },
    editExtraProductFoods: async (
      _: GraphQLResolveInfo,
      args: { exPid: string; extraName: string; extraPrice: number },
      context: GraphQLContext
    ) => {
      const { exPid, extraName, extraPrice } = args
      try {
        const services = ProductExtraServicesTenantFactory(context.restaurant ?? '')
        return await services.update.execute({ exPid, extraName, extraPrice })
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Unexpected error',
          data: null,
        }
      }
    },
  }
}
