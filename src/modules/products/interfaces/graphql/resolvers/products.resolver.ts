import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { CategoryProductRepositoryServicesTenantFactory } from '../../../../category_products/main/factories/category_products-services.factory'
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
    },
    /**
     * Nested availability for a product (days + time ranges).
     * Reads from the same table the mutation writes to (`product_availables`),
     * so the admin modal and cards stay consistent with what was saved.
     * Returns an empty array when the product has no schedule.
     */
    getAllAvailableProduct: async (
      parent: { pId?: string | null; getAllAvailableProduct?: unknown },
      _args: unknown,
      context: GraphQLContext
    ) => {
      // Respect a pre-resolved value (e.g. when the parent query already
      // included the association) to avoid an extra DB round-trip.
      if (Array.isArray(parent?.getAllAvailableProduct)) {
        return parent.getAllAvailableProduct
      }
      const pId = parent?.pId
      if (!pId || !context.restaurant) {
        return []
      }
      const services = ProductServicesTenantFactory(context.restaurant)
      const result = await services.getAvailableProducts.execute(pId, context.restaurant)
      return result.data
    },
    /**
     * Alias field used by the category listing (cards). Same source of truth
     * as `getAllAvailableProduct` so the "available today" indicator matches
     * what the detail modal shows.
     */
    product_availables: async (
      parent: { pId?: string | null; product_availables?: unknown },
      _args: unknown,
      context: GraphQLContext
    ) => {
      if (Array.isArray(parent?.product_availables)) {
        return parent.product_availables
      }
      const pId = parent?.pId
      if (!pId || !context.restaurant) {
        return []
      }
      const services = ProductServicesTenantFactory(context.restaurant)
      const result = await services.getAvailableProducts.execute(pId, context.restaurant)
      return result.data
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
    /**
     * Busca un producto ACTIVO por código de barras dentro del tenant actual.
     * Seguridad multi-tenant: el store sale de `context.restaurant` (header
     * autenticado), nunca del cliente, así un código no puede traer productos
     * de otra tienda. Devuelve un resultado con `status` diferenciado
     * (FOUND / NOT_FOUND / INVALID) y maneja errores de servidor sin filtrar
     * detalles internos.
     */
    findProductByBarcode: async (
      _: GraphQLResolveInfo,
      args: { ProBarCode: string },
      context: GraphQLContext
    ) => {
      const store = context.restaurant ?? ''
      if (!store) {
        return {
          success: false,
          status: 'INVALID',
          message: 'No hay una tienda activa en la sesión.',
          barcode: '',
          data: null
        }
      }
      try {
        const services = ProductServicesTenantFactory(store)
        return await services.findByBarcode.execute(args?.ProBarCode ?? '')
      } catch (err) {
        return {
          success: false,
          status: 'ERROR',
          message: err instanceof Error ? err.message : 'Error inesperado al buscar el producto',
          barcode: '',
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
    updateStatusProduct: async (
      _: GraphQLResolveInfo,
      args: {
        pId: string
        pState?: number | null
      },
      context: GraphQLContext
    ) => {
      try {
        // 1. Validate authenticated session.
        const validator = new ContextValidator(context)
        validator.validateUserSession()

        // 2. Get arguments.
        const pId = String(args?.pId ?? '').trim()
        const pState = args?.pState

        if (!pId) {
          return {
            success: false,
            message: 'El identificador del producto (pId) es requerido',
            data: null
          }
        }

        if (typeof pState !== 'number') {
          return {
            success: false,
            message: 'El estado del producto (pState) es requerido',
            data: null
          }
        }

        // 3. Get authenticated tenant.
        const store = context.restaurant ?? ''

        if (!store) {
          return {
            success: false,
            message: 'No hay una tienda activa en la sesión',
            data: null
          }
        }

        // 4. Execute use case using the tenant-specific factory.
        const services = ProductServicesTenantFactory(store)

        return await services.updateStatusProduct.execute({
          pId,
          pState
        })
      } catch (err) {
        console.error('updateStatusProduct resolver:', err)

        return {
          success: false,
          message: err instanceof Error
            ? err.message
            : 'Error inesperado al actualizar el estado del producto',
          data: null
        }
      }
    },
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
    },
    updateProductCategory: async (
      _: GraphQLResolveInfo,
      args: { pId: string; carProId: string },
      context: GraphQLContext
    ) => {
      try {
        const { pId, carProId } = args ?? {}

        if (!pId || !carProId) {
          return {
            success: false,
            data: null,
            message: 'pId y carProId son requeridos',
            errors: [
              {
                message: 'pId y carProId son requeridos para actualizar la categoría del producto',
                path: ['pId', 'carProId'],
                type: 'required'
              }
            ]
          }
        }

        const store = context.restaurant ?? ''

        // Validate the category exists before associating it with the product,
        // mirroring how `registerTagToProduct` validates the tag first.
        const categoryServices = CategoryProductRepositoryServicesTenantFactory(store)
        const category = await categoryServices.getOne.execute(carProId)

        if (!category) {
          return {
            success: false,
            data: null,
            message: 'La categoría no existe',
            errors: [
              {
                message: 'No se encontró una categoría con ese carProId',
                path: ['carProId'],
                type: 'not_found'
              }
            ]
          }
        }

        // The product→category relationship lives as the `carProId` FK on the
        // product, so updating the category is just updating that column.
        const productServices = ProductServicesTenantFactory(store)
        const result = await productServices.edit.execute({ pId, carProId })

        return {
          success: result?.success ?? false,
          message: result?.success
            ? 'Categoría del producto actualizada correctamente'
            : (result?.message ?? 'No se pudo actualizar la categoría del producto'),
          data: result?.data ?? null
        }
      } catch (err) {
        return {
          success: false,
          data: null,
          message: err instanceof Error ? err.message : 'Error inesperado al actualizar la categoría',
          errors: [
            {
              message: err instanceof Error ? err.message : String(err),
              path: ['updateProductCategory'],
              type: 'unexpected_error'
            }
          ]
        }
      }
    }
  }
}
