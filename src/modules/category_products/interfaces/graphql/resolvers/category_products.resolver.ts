import { GraphQLResolveInfo } from 'graphql'
import { GraphQLContext } from '../../../../../shared/types/context'
import { ProductServicesTenantFactory } from '../../../../products/main/factories/products-services.factory'
import { CategoryProductRepositoryServicesTenantFactory } from '../../../main/factories/category_products-services.factory'

interface CategoryPaginationArgs {
  page?: number | null
  max?: number | null
  search?: string | null
  pState?: number | null
  mode?: 'offset' | 'cursor' | null
  cursor?: string | null
}

interface CreateCategoryArgs {
  input?: { pName?: string | null; ProDescription?: string | null } | null
}

export const categoryProductResolvers = {
  Type: {
    catProductsWithProduct: {
      productFoodsAll: async (parent: any, _args: any, context: GraphQLContext, _info: GraphQLResolveInfo) => {
        if (!context.restaurant) throw new Error('Restaurant is required in context')
        const services = ProductServicesTenantFactory(context.restaurant)
        return services.getAllProductsByCategoryId.execute(parent.carProId)
      }
    }
  },
  Query: {
    catProductsAll: async (_: GraphQLResolveInfo, __: {}, context: GraphQLContext) => {
      if (!context.restaurant) throw new Error('Restaurant is required in context')
      const services = CategoryProductRepositoryServicesTenantFactory(context.restaurant)
      const { data } = await services.getAll.execute()
      return data
    },
    catProductsPaginated: async (_: unknown, args: CategoryPaginationArgs, context: GraphQLContext) => {
      if (!context.restaurant) throw new Error('Restaurant is required in context')
      const page = Math.max(1, Math.floor(args.page ?? 1))
      const max = Math.max(1, Math.min(100, Math.floor(args.max ?? 20)))
      if (args.mode != null && args.mode !== 'offset' && args.mode !== 'cursor') {
        throw new Error('Invalid pagination mode')
      }
      const services = CategoryProductRepositoryServicesTenantFactory(context.restaurant)
      return services.getPaginated.execute(
        context.restaurant,
        { mode: args.mode ?? 'offset', page, max, cursor: args.cursor ?? undefined },
        { search: args.search ?? undefined, pState: args.pState ?? undefined }
      )
    },
    getCatProductsWithProduct: async (_: GraphQLResolveInfo, args: any, context: GraphQLContext) => {
      if (!context.restaurant) throw new Error('Restaurant is required in context')
      const services = CategoryProductRepositoryServicesTenantFactory(context.restaurant)
      return services.getCatProductsWithProduct.execute(args)
    }
  },
  Mutation: {
    updatedProducts: async (_: unknown, args: CreateCategoryArgs, context: GraphQLContext) => {
      if (!context.restaurant) throw new Error('Restaurant is required in context')
      if (!context.User?.id) throw new Error('Authentication is required')
      const input = args.input
      if (!input) return { success: false, message: 'Debes proporcionar los datos de la categoría.' }
      if (typeof input.pName !== 'string') {
        return { success: false, message: 'El nombre de la categoría es obligatorio.' }
      }
      const pName = input.pName.trim().replace(/\s+/g, ' ')
      if (pName.length < 2 || pName.length > 120) {
        return { success: false, message: 'El nombre debe contener entre 2 y 120 caracteres.' }
      }
      if (input.ProDescription != null && typeof input.ProDescription !== 'string') {
        return { success: false, message: 'La descripción no es válida.' }
      }
      const ProDescription = input.ProDescription?.trim() ?? ''
      if (ProDescription.length > 1000) {
        return { success: false, message: 'La descripción no puede superar los 1000 caracteres.' }
      }
      // Permission to mutate this restaurant must be verified by the authentication context/middleware.
      const services = CategoryProductRepositoryServicesTenantFactory(context.restaurant)
      return services.create.execute({
        idStore: context.restaurant,
        id: context.User.id,
        pName,
        ProDescription,
        pState: 1
      })
    }
  }
}
