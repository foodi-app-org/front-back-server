
import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { TableServicesFactory } from '../../../infrastructure/services'

export const tableResolvers = {
  Query: {
    storeTables: async (_: GraphQLResolveInfo, __: any, context: GraphQLContext) => {
      const services = TableServicesFactory(context?.restaurant ?? '')
      return services.getAll.execute() ?? []
    }
  },
  Mutation: {
  }
}
