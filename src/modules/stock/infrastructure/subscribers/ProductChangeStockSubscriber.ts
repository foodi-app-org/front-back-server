import { StockServicesTenantFactory } from "@modules/stock/main/factories/stock.factory"
import { eventBus } from "@shared/infrastructure/event-bus"
import { eventBusConstants } from "@shared/infrastructure/persistence/event-bus/constants"
import { PubSub } from "graphql-subscriptions"

export const ProductChangeStockSubscriber = (pubsub: PubSub) => {
    return eventBus.subscribe(eventBusConstants.CHANGE_STOCK_SUBSCRIBER , async (event) => {
    const { 
        pId, 
        quantity, 
        idStore,
        transaction
     } = event.payload ?? {
        pId: null,
        quantity: 0,
        idStore: null,
        transaction: null
     }
    const stockService = StockServicesTenantFactory(idStore, pubsub)
    await stockService.decrement(pId, quantity, idStore, transaction)
  })
}
