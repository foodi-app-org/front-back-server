import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { ProductCategoryProps } from '../../../domain/entities/category_products.entity'
import { CategoryProductRepositoryServices } from '../../../infrastructure/services'
import { CategoryProductSchema } from '../../../infrastructure/validators/create-product-category.validator'


interface NewRegisterCategoryProductStoreArgs {
  input: ProductCategoryProps
}

export const categoryProductResolvers = {
  Query: {

  },
  Mutation: {
    updatedProducts: async (_: GraphQLResolveInfo, args: NewRegisterCategoryProductStoreArgs, context: GraphQLContext) => {
      const { error } = CategoryProductSchema.validate(args.input)
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
      
      const body = {
        ...args.input,
        createdAt: new Date(),
        idStore: context?.restaurant ?? ''
      }
      return await CategoryProductRepositoryServices.create.execute(body)
    }
  }
}
