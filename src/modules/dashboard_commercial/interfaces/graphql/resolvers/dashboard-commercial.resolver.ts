import { GraphQLError, GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { getTenantName } from '../../../../../shared/utils/tenant.utils'
import {
  DashboardFilterError,
  normalizeDashboardFilter,
  RawDashboardFilterInput
} from '../../../application/filters.validator'
import { SequelizeDashboardCommercialRepository } from '../../../infrastructure/repositories/sequelize.dashboard.repository'
import { ContextValidator } from '@shared/utils/context-validator'

interface DashboardArgs {
  filter?: RawDashboardFilterInput | null
}

/**
 * Builds a tenant-scoped repository from the GraphQL context.
 * The tenant is derived from the authenticated `restaurant` header, never from
 * a client-supplied id, preserving cross-tenant isolation.
 */
const repositoryFromContext = (idStore?: string): SequelizeDashboardCommercialRepository => {
  return new SequelizeDashboardCommercialRepository(getTenantName(idStore ?? ''))
}

/**
 * Normalizes input and converts validation failures into GraphQL errors.
 */
const resolveFilter = (args: DashboardArgs) => {
  try {
    return normalizeDashboardFilter(args.filter)
  } catch (error) {
    if (error instanceof DashboardFilterError) {
      throw new GraphQLError(error.message, {
        extensions: { code: 'BAD_USER_INPUT', http: { status: 400 } }
      })
    }
    throw error
  }
}

/**
 * GraphQL resolvers for the commercial dashboard. All queries are read-only,
 * tenant-scoped, and validate their filter input before touching the DB.
 */
export const dashboardCommercialResolvers = {
  Query: {
    getDashboardSummary: async (
      _root: GraphQLResolveInfo,
      args: DashboardArgs,
      context: GraphQLContext
    ) => {
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()
      return repositoryFromContext(String(idStore)).getSummary(resolveFilter(args))
    },

    getDashboardSalesTrend: async (
      _root: GraphQLResolveInfo,
      args: DashboardArgs,
      context: GraphQLContext
    ) => {
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()
      return repositoryFromContext(String(idStore)).getSalesTrend(resolveFilter(args))
    },

    getDashboardSalesByCategory: async (
      _root: GraphQLResolveInfo,
      args: DashboardArgs,
      context: GraphQLContext
    ) => {
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()
      return repositoryFromContext(String(idStore)).getSalesByCategory(resolveFilter(args))
    },

    getDashboardTopProducts: async (
      _root: GraphQLResolveInfo,
      args: DashboardArgs,
      context: GraphQLContext
    ) => {
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()
      return repositoryFromContext(String(idStore)).getTopProducts(resolveFilter(args))
    },

    getDashboardRecentOrders: async (
      _root: GraphQLResolveInfo,
      args: DashboardArgs,
      context: GraphQLContext
    ) => {
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()
      return repositoryFromContext(String(idStore)).getRecentOrders(resolveFilter(args))
    }
  }
}
