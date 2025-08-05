import { GraphQLResolveInfo } from 'graphql'

import { Services } from '../../../infrastructure/services'
import { CreateCategoryStoreInput } from '../inputs'

export const categoryStoreResolvers = {
  Query: {
  },
  Mutation: {
    registerCategoryStore: async (_: GraphQLResolveInfo, args: { input: CreateCategoryStoreInput }) => {
      return await Services.create.execute(args.input)
    }
  }
}
