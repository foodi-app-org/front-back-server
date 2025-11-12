import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { Clients } from '@modules/clients/domain'
import { ClientServicesTenantFactory } from '@modules/clients/main/factories/roles-services.factory'

export const clientResolvers = {
  /**
   * Query to get client details by ID
   */
  Query: {
    getAllClients: async (_: GraphQLResolveInfo, _args: { id: string }, context: GraphQLContext) => {
      const services = ClientServicesTenantFactory(String(context.restaurant))
      return services.getAll.execute(String(context.restaurant))
    }
  },
  Mutation: {
    createClients: async (_: GraphQLResolveInfo, args: { input: Clients }, _context: GraphQLContext) => {
      const {
        clientName,
        clientLastName,
        clientAddress,
        ccClient,
        gender
      } = args.input
      const services = ClientServicesTenantFactory(String(_context.restaurant))
      const payload = {
        idStore: String(_context.restaurant),
        clientName: clientName ?? null,
        clientLastName: clientLastName ?? null,
        clientAddress: clientAddress ?? null,
        ccClient: ccClient ?? null,
        gender: gender ?? 0
      } as unknown as Clients
      return await services.create.execute(payload)
    }
  }
}
