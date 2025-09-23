import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { ProductServicesTenantFactory } from '../../../../products/main/factories/products-services.factory'
import { CategoryProductRepositoryServicesTenantFactory } from '../../../main/factories/category_products-services.factory'


export const categoryProductResolvers = {
  Type: {
    catProductsWithProduct: {
      productFoodsAll: async (parent: any, _args: any, context: GraphQLContext, _info: GraphQLResolveInfo) => {
        const services = ProductServicesTenantFactory(context.restaurant ?? '')
        return services.getAllProductsByCategoryId.execute(parent.carProId)
      }
    }
  },
  Query: {
    catProductsAll: async (_: GraphQLResolveInfo, __: {}, context: GraphQLContext) => {
      const services = CategoryProductRepositoryServicesTenantFactory(context.restaurant ?? '')
      const { data } = await services.getAll.execute()
      return data
    },
    getCatProductsWithProduct: async (_: GraphQLResolveInfo, args: any, context: GraphQLContext) => {
      const services = CategoryProductRepositoryServicesTenantFactory(context.restaurant ?? '')
      const data = await services.getCatProductsWithProduct.execute(args)
      return data
    }
  },
  Mutation: {
  }
}
