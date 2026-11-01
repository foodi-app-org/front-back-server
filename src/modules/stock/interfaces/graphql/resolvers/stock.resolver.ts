import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { getTenantName } from '../../../../../shared/utils/tenant.utils'
import { SequelizeStockRepository } from '../../../infrastructure/repositories/sequelize.controller.repository'

/**
 * GraphQL resolvers for the stock module.
 */
export const stockResolvers = {
  Query: {
    /**
     * Ranking of best-selling products based on outgoing (DECREMENT) stock movements.
     */
    getTopProductsMovements: async (
      _root: GraphQLResolveInfo,
      _args: Record<string, never>,
      context: GraphQLContext
    ) => {
      const repository = new SequelizeStockRepository(getTenantName(context?.restaurant ?? ''))
      return await repository.findTopProductsMovements()
    }
  }
}
