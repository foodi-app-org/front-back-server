import { EscposNetworkPrinterAdapter } from "@modules/pos_print_core/infrastructure/adapters/escpos-usb-printer.adapter";
import { ProductServicesTenantFactory } from "@modules/products/main/factories/products-services.factory";
import { StatusOrderServicesTenantFactory } from "@modules/status_order/infrastructure/services";
import { StoreServicesTenantFactory } from "@modules/store/main/factories/store-services.factory";
import { GraphQLContext } from "@shared/types/context";

const printer = new EscposNetworkPrinterAdapter()

export const printResolvers = {
  Mutation: {
    printSaleTicket: async (_: any, { saleId }: { saleId: string }, context: GraphQLContext) => {
      try {
        const idStore = context.restaurant ?? ''
        const services = StatusOrderServicesTenantFactory(idStore)
        const response = await services.getOneByCodeRef.execute(saleId)
        const servicesProduct = ProductServicesTenantFactory(idStore)
        const servicesStore = StoreServicesTenantFactory(idStore)
        const store = await servicesStore.findById.execute(idStore)
        const products = await servicesProduct.getAllProductSoldByPCodeRef.execute(saleId)
        const sale = {
          ...response?.data,
          date: new Date().toLocaleString(),
          store,
          client: null,
          products: products
        }
        await printer.print(sale)
        return {
          success: true,
          message: 'Ticket enviado a imprimir correctamente',
          data: null
        }
      } catch (err) {
        return { success: false, message: (err as Error).message }
      }
    }
  }
}
