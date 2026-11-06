import { GraphQLError, GraphQLResolveInfo } from 'graphql'

import {
  DashboardFilterError,
  normalizeDashboardFilter,
  RawDashboardFilterInput
} from '../../../../dashboard_commercial/application/filters.validator'
import { GraphQLContext } from '../../../../../shared/types/context'
import { getTenantName } from '../../../../../shared/utils/tenant.utils'
import { SequelizeStockRepository } from '../../../infrastructure/repositories/sequelize.controller.repository'
import { StockService } from '../../../service'
import { PubSubEventAdapter } from '../../../adapters/PubSubEventAdapter'

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
  },
  Mutation: {
    /**
     * Enables/disables inventory control for a MAIN product (`product_models`).
     * Migrated from the legacy (unloaded) `src/api` resolver so it is exposed
     * by the active modular schema. Extras keep their own edit flow.
     */
    updateManageStock: async (
      _root: GraphQLResolveInfo,
      args: { input?: { pId?: string; manageStock?: boolean } | null },
      context: GraphQLContext
    ) => {
      const pId = args?.input?.pId
      const manageStock = Boolean(args?.input?.manageStock)
      if (!pId) {
        return { success: false, message: 'pId is required', data: null }
      }
      try {
        const repository = new SequelizeStockRepository(getTenantName(context?.restaurant ?? ''))
        const data = await repository.updateProductManageStock(pId, manageStock)
        if (!data) {
          return { success: false, message: 'Producto no encontrado', data: null }
        }
        return {
          success: true,
          message: manageStock ? 'Manejo de stock habilitado' : 'Manejo de stock deshabilitado',
          data
        }
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Error al actualizar el stock',
          data: null
        }
      }
    },

    /**
     * Raises a MAIN product's stock to a target quantity, registering ONLY the
     * positive difference as an inventory ENTRY (RESTOCK) in the kardex. Mirrors
     * the product-extra edit rule: you can increase/replenish stock but never
     * lower it from here (lowering goes through sales or an inventory
     * adjustment). Reuses the shared StockService.restock so the physical stock
     * and stock_history stay consistent with a single movement (no double
     * counting). Returns an error (`success: false`) when the target is not
     * greater than the current stock, so lowering/no-op attempts are rejected
     * and surfaced in the UI instead of silently succeeding.
     */
    restockProduct: async (
      _root: GraphQLResolveInfo,
      args: { input?: { pId?: string; stock?: number } | null },
      context: GraphQLContext
    ) => {
      const pId = args?.input?.pId
      const target = Number(args?.input?.stock)
      if (!pId) {
        return { success: false, message: 'pId is required', data: null }
      }
      if (!Number.isFinite(target) || target < 0) {
        return { success: false, message: 'stock objetivo inválido', data: null }
      }
      try {
        const tenant = getTenantName(context?.restaurant ?? '')
        const repository = new SequelizeStockRepository(tenant)

        const row = await repository.findByIdForUpdate(pId)
        if (!row) {
          return { success: false, message: 'Producto no encontrado', data: null }
        }
        if (!row.manageStock) {
          return { success: false, message: 'El producto no gestiona stock', data: null }
        }

        const current = Number(row.stock ?? 0)
        const delta = target - current
        if (delta < 0) {
          // Lowering stock is not allowed from this flow: report it as an error
          // so the UI surfaces it (reductions go through sales or an inventory
          // adjustment, never this entry/restock flow).
          return {
            success: false,
            message: `No se puede bajar el stock. El stock actual es ${current} y solo se permite registrar entradas (subir el stock).`,
            data: { pId, manageStock: true, stock: current, previousStock: Number(row.previousStock ?? 0) }
          }
        }
        if (delta === 0) {
          // No-op: the target equals the current stock, nothing to register.
          return {
            success: false,
            message: 'El stock no cambió. Indica una cantidad mayor al stock actual para registrar una entrada.',
            data: { pId, manageStock: true, stock: current, previousStock: Number(row.previousStock ?? 0) }
          }
        }

        const publisher = context.pubsub ? PubSubEventAdapter(context.pubsub) : undefined
        const stockService = new StockService({ repository, publisher })
        // restock adds exactly `delta` and writes a single RESTOCK row.
        const result = await stockService.restock(pId, delta)

        return {
          success: true,
          message: `Entrada de inventario registrada (+${delta})`,
          data: { pId, manageStock: true, stock: result.remaining, previousStock: current }
        }
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Error al reponer el stock',
          data: null
        }
      }
    }
  }
}
