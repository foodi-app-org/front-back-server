import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { ClientsServices } from '../../../infrastructure/services/'

export const clientResolvers = {
  /**
   * Query to get client details by ID
   */
  Query: {
    getAllClients: async (_: GraphQLResolveInfo, _args: { id: string }, _context: GraphQLContext) => {
      return await ClientsServices.getAll.execute()
    }
  },
  Mutation: {
  }
}
