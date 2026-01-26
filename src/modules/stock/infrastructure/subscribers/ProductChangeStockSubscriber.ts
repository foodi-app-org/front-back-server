import { StockServicesTenantFactory } from "@modules/stock/main/factories/stock.factory"
import { eventBusConstants } from "@shared/infrastructure/persistence/event-bus/constants"
import { PubSub } from "graphql-subscriptions"

export const ProductChangeStockSubscriber = (pubsub: PubSub) => {
   return {
      eventName: eventBusConstants.CHANGE_STOCK_SUBSCRIBER,
      handler: async (event) => {
         console.log("🚀 ~ ProductChangeStockSubscriber ~ event:", event)
         const {
            pId,
            quantity,
            idStore
         } = event.payload ?? {
            pId: null,
            quantity: 0,
            idStore: null,
            transaction: null
         }
         const stockService = StockServicesTenantFactory(idStore, pubsub)
         await stockService.decrement(pId, quantity, idStore)
      }
   }
}
