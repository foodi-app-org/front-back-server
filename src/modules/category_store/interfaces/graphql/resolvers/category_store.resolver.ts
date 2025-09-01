import { GraphQLResolveInfo } from 'graphql'

import { Services } from '../../../infrastructure/services'
import { CreateCategoryStoreInput } from '../inputs'

export const categoryStoreResolvers = {
  
  Query: {
    getAllCatStore: async (_: GraphQLResolveInfo) => {
      return await Services.getAll.execute()
    }
  },
  Mutation: {
    registerCategoryStore: async (_: GraphQLResolveInfo, args: { input: CreateCategoryStoreInput }) => {
      const { cName, csDescription, cState, cPathImage } = args.input
      return await Services.create.execute({
        cName,
        csDescription,
        cState,
        cPathImage
      })
    }
  }
}
