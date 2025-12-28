import { PubSubEventAdapter } from "@modules/stock/adapters/PubSubEventAdapter"
import { StockServiceOptions } from "@modules/stock/domain/types"
import { SequelizeStockRepository } from "@modules/stock/infrastructure/repositories/sequelize.controller.repository"
import { StockService } from "@modules/stock/service"
import { getTenantName } from "@shared/utils/tenant.utils"
import { PubSub } from "graphql-subscriptions"
import { Transaction } from "sequelize"

export type StockServicesTenant = {
    reserve: (pId: string, quantity: number, trx?: Transaction, opts?: Partial<StockServiceOptions>) => Promise<any>
    release: (pId: string, quantity: number, trx?: Transaction, opts?: Partial<StockServiceOptions>) => Promise<any>
    decrement: (pId: string, quantity: number, idStore: string, trx?: Transaction, opts?: Partial<StockServiceOptions>) => Promise<any>
    restock: (pId: string, quantity: number, trx?: Transaction, opts?: Partial<StockServiceOptions>) => Promise<any>
    getStock: (pId: string) => Promise<number | null>
}

/**
 * Factory that returns a tenant-scoped, safe-to-use service API.
 * Methods are arrow-wrapped so `this`/context is preserved and you can pass them directly around.
 *
 * @param tenant tenant identifier (will be normalized with getTenantName)
 */
export const StockServicesTenantFactory = (tenant: string, pubsub: PubSub): StockServicesTenant => {
    const stockRepository = new SequelizeStockRepository(getTenantName(tenant))
    const eventPublisher = PubSubEventAdapter(pubsub)
    const stockService = new StockService({ repository: stockRepository, publisher: eventPublisher })

    return {
        reserve: stockService.reserveStock,
        release: stockService.releaseReservation,
        decrement: stockService.decrementStock,
        restock: stockService.restock,
        getStock: stockService.getStock
    }
}