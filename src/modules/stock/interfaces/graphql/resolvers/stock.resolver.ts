import { GraphQLError, GraphQLResolveInfo } from 'graphql'

import {
  DashboardFilterError,
  normalizeDashboardFilter,
  RawDashboardFilterInput
} from '../../../../dashboard_commercial/application/filters.validator'
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
    },

    /**
     * Total monetary value of completed sales.
     */
    totalSales: async (
      _root: GraphQLResolveInfo,
      _args: Record<string, never>,
      context: GraphQLContext
    ) => {
      const repository = new SequelizeStockRepository(getTenantName(context?.restaurant ?? ''))
      return await repository.findTotalSales()
    },

    /**
     * Number of completed orders.
     */
    getTotalSalesSold: async (
      _root: GraphQLResolveInfo,
      _args: Record<string, never>,
      context: GraphQLContext
    ) => {
      const repository = new SequelizeStockRepository(getTenantName(context?.restaurant ?? ''))
      return await repository.findTotalSalesSold()
    },

    /**
     * Total units sold (sum of outgoing DECREMENT stock).
     */
    getTotalProductsSold: async (
      _root: GraphQLResolveInfo,
      _args: Record<string, never>,
      context: GraphQLContext
    ) => {
      const repository = new SequelizeStockRepository(getTenantName(context?.restaurant ?? ''))
      return await repository.findTotalProductsSold()
    },

    /**
     * Total managed units currently in stock.
     */
    getTotalProductsInStock: async (
      _root: GraphQLResolveInfo,
      _args: Record<string, never>,
      context: GraphQLContext
    ) => {
      const repository = new SequelizeStockRepository(getTenantName(context?.restaurant ?? ''))
      return await repository.findTotalProductsInStock()
    },

    /**
     * Daily aggregated IN/OUT/ADJUSTMENT movements. Accepts an optional
     * dashboard filter so the chart respects the selected period; without it,
     * the full history is returned (backward compatible).
     */
    getStockMovementsByDay: async (
      _root: GraphQLResolveInfo,
      args: { filter?: RawDashboardFilterInput | null },
      context: GraphQLContext
    ) => {
      const repository = new SequelizeStockRepository(getTenantName(context?.restaurant ?? ''))

      let range: { startAt: string; endAt: string } | undefined
      if (args?.filter) {
        try {
          const normalized = normalizeDashboardFilter(args.filter)
          range = { startAt: normalized.startAt, endAt: normalized.endAt }
        } catch (error) {
          if (error instanceof DashboardFilterError) {
            throw new GraphQLError(error.message, {
              extensions: { code: 'BAD_USER_INPUT', http: { status: 400 } }
            })
          }
          throw error
        }
      }

      return await repository.findStockMovementsByDay(range)
    },

    /**
     * Week-over-week outgoing stock comparison.
     */
    getStockMovementWeeklyComparison: async (
      _root: GraphQLResolveInfo,
      _args: Record<string, never>,
      context: GraphQLContext
    ) => {
      const repository = new SequelizeStockRepository(getTenantName(context?.restaurant ?? ''))
      return await repository.findStockMovementWeeklyComparison()
    }
  }
}
