import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { CategoryProductRepositoryServicesTenantFactory } from '../../../main/factories/category_products-services.factory'


export const categoryProductResolvers = {
  Query: {
    catProductsAll: async (_: GraphQLResolveInfo, __: {}, context: GraphQLContext) => {
      const services = CategoryProductRepositoryServicesTenantFactory(context.restaurant ?? '')
      const { data }  = await services.getAll.execute()
      console.log("🚀 ~ data:", data)
      return data
    },
  },
  Mutation: {
  }
}
