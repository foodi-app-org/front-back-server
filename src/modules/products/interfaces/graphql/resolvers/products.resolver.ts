import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { productSchema } from '../../../infrastructure/validators'
import { ProductServicesTenantFactory } from '../../../main/factories/products-services.factory'
import { CreateMultipleProducts, CreateStatusTypeOrderInput } from '../inputs'
import { QueryProductFoodsAllArgs } from 'generated/graphql'
import { IProduct } from '@modules/products/domain'

export const productResolvers = {
  Query: {
    productFoodsOne: async (_: GraphQLResolveInfo, args: { pId: string }, context: GraphQLContext) => {
      const { pId } = args ?? {
        pId: ''
      }

      try {
        const services = ProductServicesTenantFactory(context.restaurant ?? '')
        const result = await services.findById.execute(pId)
        const { data } = result ?? {
          data: null
        }
        return data
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Unexpected error',
          data: null
        }
      }
    },
    productFoodsAll: async (_: GraphQLResolveInfo, args: QueryProductFoodsAllArgs, context: GraphQLContext) => {
      try {
        const {
          page,
          max,
          search
        } = args ?? {}
        const pagination = {
          max, // Máximo número de registros por página
          page // Página actual
        } as { page: number; max: number }
        const store = context.restaurant ?? ''
        const services = ProductServicesTenantFactory(store)
        return await services.productFoodsAll.execute(
          store,
          pagination,
          search
        )
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Unexpected error',
          data: null
        }
      }
    }
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
    },
    setImageProducts: async (
      _: GraphQLResolveInfo,
      args: { input: { pId: string; image: any } },
      context: GraphQLContext
    ) => {
      const { pId, image } = args.input
      try {
        const services = ProductServicesTenantFactory(context.restaurant ?? '')
        return await services.setImageProduct.execute({ pId, image })
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Unexpected error',
          data: null
        }
      }
    },
    updateMultipleProducts: async (_: GraphQLResolveInfo, args: { input: CreateMultipleProducts[] }, context: GraphQLContext) => {
      const services = ProductServicesTenantFactory(context.restaurant ?? '')
      const productsSucess: IProduct[] = []
      const products = args.input
      for (const product of products) {
        const { error, value } = productSchema.validate({
          ...product,
          idStore: context.restaurant ?? ''
        }, {
          abortEarly: true
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
        const response = await services.create.execute(value)
        console.log(response)
        const { success, data } = response || {}
        if (success && data) {
          productsSucess.push(data)
        }
      }
      return productsSucess
    },
  }
}
