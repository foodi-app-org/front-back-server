import { ClientServicesTenantFactory } from '@modules/clients/main/factories/roles-services.factory'
import { computeCartTotals } from '@modules/pos_print_core/domain/services'
import { EscposNetworkPrinterAdapter } from '@modules/pos_print_core/infrastructure/adapters/escpos-usb-printer.adapter'
import { ShoppingCartServicesTenantFactory } from '@modules/shopping/main/factories/shopping.factories'
import { StatusOrderServicesTenantFactory } from '@modules/status_order/infrastructure/services'
import { StoreServicesTenantFactory } from '@modules/store/main/factories/store-services.factory'
import { GraphQLContext } from '@shared/types/context'
import { convertTimezone } from '@shared/utils/convert-time-zone'

const printer = new EscposNetworkPrinterAdapter()

export const printResolvers = {
  Mutation: {
    printSaleTicket: async (_: any, { saleId }: { saleId: string }, context: GraphQLContext) => {
      try {
        const idStore = context.restaurant ?? ''
        const services = StatusOrderServicesTenantFactory(idStore)
        const response = await services.getOneByCodeRef.execute(saleId)
        const {
          success,
          message,
          data
        } = response ?? {
          success: false,
          message: 'Error al obtener la venta',
          data: null
        }
        if (success === false) {
          throw new Error(message)
        }
        const {
          id: clientId,
          createdAt,
          shoppingCartRefCode
        } = data ?? {
          id: null,
          createdAt: null,
          shoppingCartRefCode: ''
        }

        const pCodeRef = saleId
        const shoppingServices = ShoppingCartServicesTenantFactory(idStore)
        const saleCart = await shoppingServices.getAllByRefCode.execute(String(shoppingCartRefCode), pCodeRef)
        const servicesStore = StoreServicesTenantFactory(idStore)
        const servicesClient = ClientServicesTenantFactory(idStore)
        const store = await servicesStore.findById.execute(idStore)
        const client =  await servicesClient.findById.execute(String(clientId || idStore))
        const totals = computeCartTotals(saleCart as any[], {
          rounding: 2
        })
        const sale = {
          date: convertTimezone(createdAt as Date),
          store,
          client: client?.data,
          products: saleCart,
          totals,
          info: {
            pCodeRef
          }
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
