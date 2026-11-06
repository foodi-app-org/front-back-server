import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { TagsServicesTenantFactory } from '../../../../tags/main/factories/store-services.factory'
import { productSchema } from '../../../infrastructure/validators'
import { ProductServicesTenantFactory } from '../../../main/factories/products-services.factory'
import { CreateMultipleProducts, CreateStatusTypeOrderInput } from '../inputs'
import { QueryProductFoodsAllArgs } from 'generated/graphql'
import { IProduct } from '@modules/products/domain'
import { ContextValidator } from '@shared/utils/context-validator'

export const productResolvers = {
  ProductFood: {
    getOneTags: async (
      parent: { tgId?: string | null },
      _args: unknown,
      context: GraphQLContext
    ) => {
      const tgId = parent?.tgId
      if (!tgId || !context.restaurant) {
        return null
      }
      const services = TagsServicesTenantFactory(context.restaurant)
      return services.getOne.execute({
        idStore: context.restaurant,
        tgId
      })
    }
  },
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
    productFoodsAll: async (
      _: GraphQLResolveInfo,
      args: QueryProductFoodsAllArgs & {
        priceMin?: number | null
        priceMax?: number | null
        orderBy?: Array<string | null> | null
      },
      context: GraphQLContext
    ) => {
      try {
        const {
          page,
          max,
          search,
          categories,
          pState,
          priceMin,
          priceMax,
          orderBy
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
          search,
          {
            categories: (categories ?? []).filter(Boolean) as string[],
            pState: typeof pState === 'number' ? pState : undefined,
            priceMin: typeof priceMin === 'number' ? priceMin : undefined,
            priceMax: typeof priceMax === 'number' ? priceMax : undefined,
            orderBy: (orderBy ?? []).filter(Boolean) as string[]
          }
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
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()
      const values = {
        ...args.input,
        manageStock: true,
        stock: Number((args.input as { stock?: number })?.stock) || 1
      }
      const { error, value } = productSchema.validate({
        ...values,
        idStore: idStore ?? ''
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
    editProductFoods: async (
      _: GraphQLResolveInfo,
      args: { input: CreateStatusTypeOrderInput & { pId?: string } },
      context: GraphQLContext
    ) => {
      try {
        const { pId, ...rest } = args.input ?? {}
        if (!pId) {
          return {
            success: false,
            message: 'El identificador del producto (pId) es requerido'
          }
        }
        const services = ProductServicesTenantFactory(context.restaurant ?? '')
        const result = await services.edit.execute({ pId, ...rest })
        return {
          success: result?.success ?? false,
          message: result?.message ?? 'No se pudo actualizar el producto'
        }
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Error inesperado al actualizar el producto'
        }
      }
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
    registerTagToProduct: async (
      _: GraphQLResolveInfo,
      args: { pId: string; tgId: string },
      context: GraphQLContext
    ) => {
      try {
        const { pId, tgId } = args ?? {}

        if (!pId || !tgId) {
          return {
            success: false,
            data: null,
            message: 'pId y tgId son requeridos',
            errors: [
              {
                message: 'pId y tgId son requeridos para asociar el tag',
                path: ['pId', 'tgId'],
                type: 'required'
              }
            ]
          }
        }

        const store = context.restaurant ?? ''

        // Validate the tag exists before associating it with the product.
        const tagServices = TagsServicesTenantFactory(store)
        const tag = await tagServices.getOne.execute({ idStore: store, tgId })

        if (!tag) {
          return {
            success: false,
            data: null,
            message: 'El tag no existe',
            errors: [
              {
                message: 'No se encontró un tag activo con ese tgId',
                path: ['tgId'],
                type: 'not_found'
              }
            ]
          }
        }

        // The product→tag relationship lives as the `tgId` FK on the product,
        // so associating the tag is just updating that column.
        const productServices = ProductServicesTenantFactory(store)
        const result = await productServices.edit.execute({ pId, tgId })

        return {
          success: result?.success ?? false,
          message: result?.success
            ? 'Tag asociado al producto correctamente'
            : (result?.message ?? 'No se pudo asociar el tag al producto'),
          data: result?.data ?? null
        }
      } catch (err) {
        return {
          success: false,
          data: null,
          message: err instanceof Error ? err.message : 'Error inesperado al asociar el tag',
          errors: [
            {
              message: err instanceof Error ? err.message : String(err),
              path: ['registerTagToProduct'],
              type: 'unexpected_error'
            }
          ]
        }
      }
    }
  }
}
