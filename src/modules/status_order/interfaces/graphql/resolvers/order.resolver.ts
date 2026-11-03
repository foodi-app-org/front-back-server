import { GraphQLResolveInfo } from 'graphql'

import { Channel } from '../../../../../shared/constants/channel'
import { PickUpMethod } from '../../../../../shared/constants/typePickUp'
import connect from '../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { GraphQLContext } from '../../../../../shared/types/context'
import { ShoppingServicesTenantFactory } from '../../../../shopping/infrastructure/services'
import { StoreServicesPublic } from '../../../../store/infrastructure/services'
import { UserServices } from '../../../../user/main/factories/user-services.factory'
import { StatusOrderServicesTenantFactory } from '../../../infrastructure/services'
import { shoppingCartItemSchema, statusOrderSchema } from '../../../infrastructure/validators'
import { RegisterSalesStoreInput, StateShoppingCart } from '../inputs'
import { PubSub } from 'graphql-subscriptions'
import { ProductExtraServicesTenantFactory } from '../../../../product_extra/main/factories/product-extra-services.factory'
import { ExtraStockServicesTenantFactory } from '../../../../product_extra/infrastructure/inventory/extra-stock.factory'
import { ProductOptionalServicesTenantFactory } from '../../../../product_optional_extra/main/factories/product-optional-extra-services.factory'
import { v4 as uuiv4 } from 'uuid'
import { StatusOrderTypesServicesTenantFactory } from '@modules/status_order_types/main/factories/status_order_types.factory'
import { StatusTypeOrder } from '@shared/constants/statusTypeOrder'
import { ClientServicesTenantFactory } from '@modules/clients/main/factories/roles-services.factory'
import { ShoppingCartServicesTenantFactory } from '@modules/shopping/main/factories/shopping.factories'
import { StoreServicesTenantFactory } from '@modules/store/main/factories/store-services.factory'
import { convertTimezone } from '@shared/utils/convert-time-zone'
import { computeCartTotals } from 'exact-cart-totals'
import { PaymentMethodServicesFactory } from '@modules/payment_method/main/factories'
import { Maybe, ResponseSalesStore } from 'generated/graphql'
import {
  LogDanger,
  LogInfo,
  LogWarning
} from '@shared/utils/logger.utils'
import { SocketEvents } from '@shared/constants/socket-events'
import { eventBus } from '@shared/infrastructure/event-bus'
import { DomainEvent } from '@shared/domain/EventBus'
import { eventBusConstants } from '@shared/infrastructure/persistence/event-bus/constants'

export const orderResolvers = {
  Type: {
    StoreOrders: {
      getUser: async (parent: { dataValues: { id: string } }, _args: Record<string, unknown>, context: GraphQLContext) => {
        const idUser = parent?.dataValues?.id ?? context?.User?.id
        if (!idUser) return null
        return await UserServices.findById.execute(idUser)
      },
      getOneStore: async (parent: { dataValues: { idStore: string } }, _args: Record<string, unknown>, _context: GraphQLContext) => {
        if (!parent?.dataValues?.idStore) return null
        return await StoreServicesPublic.findById.execute(parent.dataValues.idStore)
      },
      statusOrder: async (parent: { status: string }, _args: Record<string, unknown>, context: GraphQLContext) => {
        const idStore = context.restaurant ?? ''
        const servicesStatusTypes = StatusOrderTypesServicesTenantFactory(idStore)
        if (!parent?.status) return null
        return await servicesStatusTypes.findByName.execute(parent.status)
      }
    }
  },
  Query: {
    getOneSalesStore: async (_: GraphQLResolveInfo, args: { pCodeRef: string }, context: GraphQLContext) => {
      const pCodeRef = args.pCodeRef
      if (!pCodeRef) {
        return {
          success: false,
          message: 'Code sale reference is required',
          errors: [
            {
              message: 'Code sale reference is required',
              path: ['pCodeRef'],
              type: 'required',
              context:
              {
                label: 'pCodeRef', key: 'pCodeRef'
              }
            }
          ]
        }
      }
      const idStore = context.restaurant ?? ''
      const services = StatusOrderServicesTenantFactory(idStore)
      const servicesStatusTypes = StatusOrderTypesServicesTenantFactory(idStore)
      if (!idStore) {
        return {
          success: false,
          message: 'Store not found',
          errors: []
        }
      }
      const response = await services.getOneByCodeRef.execute(args.pCodeRef)
      const statusOrderType = await servicesStatusTypes.findById.execute(response?.data?.idStatus ?? '')
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
        shoppingCartRefCode,
        discount
      } = data ?? {
        id: null,
        createdAt: null,
        shoppingCartRefCode: ''
      }
      const shoppingServices = ShoppingCartServicesTenantFactory(idStore)
      const shopping = await shoppingServices.getAllByRefCode.execute(String(shoppingCartRefCode), pCodeRef)
      const servicesStore = StoreServicesTenantFactory(idStore)
      const servicesClient = ClientServicesTenantFactory(idStore)
      const store = await servicesStore.findById.execute(idStore)
      const client = await servicesClient.findById.execute(String(clientId || idStore))
      const { getOneById } = PaymentMethodServicesFactory(context?.restaurant ?? '')
      const paymentMethod = await getOneById.execute(String(data?.payId))
      const shoppingResponse = shopping?.map(cart => {
        return {
          ...cart,
          // @ts-ignore
          products: {
            // @ts-ignore
            ...cart.products,
            // @ts-ignore
            ExtProductFoodsAll: cart.products?.dataExtra?.map((extras: any) => {
              // The sold-extra snapshot persists unit `extraPrice` + `quantity`
              // but not the line subtotal. Derive `newExtraPrice` here (read-path
              // only) so the sale detail and invoice REPRINT show the per-extra
              // subtotal, matching the live POS which computes it in the cart.
              // Falls back to the stored value when present.
              const unit = Number(extras?.extraPrice ?? 0)
              const qty = Number(extras?.quantity ?? 0)
              const derived = Number.isFinite(unit) && Number.isFinite(qty) ? unit * qty : 0
              return {
                ...extras,
                newExtraPrice: extras?.newExtraPrice ?? derived
              }
            }),
            // @ts-ignore
            ExtProductFoodOptional: cart.products?.dataOptional?.map((optionals: any) => {
              return {
                ...optionals,
              }
            })
          }
        }
      })

      // The `discount` column may hold a plain number, a numeric string, a
      // DiscountInput object ({ type, value }) or a JSON string of it. Older
      // rows persisted the object via String() coercion, producing the literal
      // "[object Object]", which crashed computeCartTotals (it expects a
      // number). Normalize to a safe numeric percent here (read-path only; the
      // sales/write flow is untouched) so the sale detail and invoice never
      // break for discounted sales.
      const resolveDiscountPercent = (raw: unknown): number => {
        if (raw == null) return 0
        if (typeof raw === 'number') return Number.isFinite(raw) ? raw : 0
        if (typeof raw === 'object') {
          const value = (raw as { value?: unknown }).value
          const n = Number(value)
          return Number.isFinite(n) ? n : 0
        }
        if (typeof raw === 'string') {
          const trimmed = raw.trim()
          if (trimmed === '' || trimmed === '[object Object]') return 0
          const direct = Number(trimmed)
          if (Number.isFinite(direct)) return direct
          try {
            const parsed = JSON.parse(trimmed)
            return resolveDiscountPercent(parsed)
          } catch {
            return 0
          }
        }
        return 0
      }
      const discountPercent = resolveDiscountPercent(discount)

      const totals = computeCartTotals(shopping as any[], {
        currencySymbol: '$',
        includeExtras: true,
        globalDiscountPercent: discountPercent,
        includeBreakdownByStore: false,
        includeLines: false,
        formatNumbers: true,
        lang: 'es'
      })

      const sale = {
        createdAt: convertTimezone(createdAt as Date),
        store,
        client: client?.data,
        shoppingCarts: shoppingResponse,
        pCodeRef,
        shoppingCartRefCode,
        info: {
          pCodeRef
        },
        paymentMethod,
        statusOrder: statusOrderType ?? null,
        discount,
        // The GraphQL `totals` field is `[OrderTotals]` (a list of
        // { key, name, value }). `computeCartTotals` returns a summary object
        // whose `.totals` property holds that list; expose the list so the
        // field resolves correctly (it previously returned the object and threw
        // "Expected Iterable" for StoreOrders.totals).
        totals: Array.isArray((totals as any)?.totals) ? (totals as any).totals : []
      }
      return {
        success: true,
        message,
        data: sale
      }
    },

    getAllSalesStore: async (
      _: GraphQLResolveInfo,
      args: {
        idStore?: string
        search?: string
        min?: number
        max?: number
        fromDate?: string
        toDate?: string
        channel?: number
      },
      context: GraphQLContext
    ) => {
      const idStore = context.restaurant ?? args?.idStore ?? ''
      const services = StatusOrderServicesTenantFactory(idStore)
      const response = await services.getAllByStatusType.execute({
        search: args?.search,
        min: args?.min,
        max: args?.max,
        fromDate: args?.fromDate,
        toDate: args?.toDate,
        channel: args?.channel
      })
      return response?.data ?? []
    }
  },
  Mutation: {
    registerSalesStore: async (
      _: GraphQLResolveInfo,
      args: RegisterSalesStoreInput,
      context: GraphQLContext
    ): Promise<Maybe<ResponseSalesStore>> => {
      const eventsToPublish: DomainEvent[] = []
      const start = Date.now()
      const idStore = context.restaurant ?? args.idStore
      const sequelize = connect()
      const t = await sequelize.transaction()
      try {
        // 1. Validaciones iniciales
        const storeExists = await StoreServicesPublic.findById.execute(idStore)
        if (!storeExists) {
          await t.rollback()
          return {
            success: false,
            message: 'Store not found',
            errors: []
          }
        }

        if (!Array.isArray(args.input) || args.input.length === 0) {
          await t.rollback()
          return {
            success: false,
            message: 'No products to add',
            data: null,
            errors: []
          }
        }

        // 2. Instanciar servicios una sola vez
        const ShoppingServices = ShoppingServicesTenantFactory(idStore)
        const StatusOrderServices = StatusOrderServicesTenantFactory(idStore)
        const ProductExtraServices = ProductExtraServicesTenantFactory(idStore)
        const ProductOptionalServices = ProductOptionalServicesTenantFactory(idStore)
        const extraStock = ExtraStockServicesTenantFactory(idStore, context.pubsub)

        // Accumulate the order total in-flight (inside the transaction) instead
        // of re-querying shopping_carts with sumPrice AFTER the loop. sumPrice
        // ran outside the tx (never saw the just-inserted rows) and ignored
        // extras, so the order was persisted with totalProductsPrice = 0/base.
        // Here we compute total = base (priceProduct * cantProducts) + extras
        // (sum of extraPrice * quantity for the selected complementos), which is
        // O(1) per line and makes the header the single source of truth for all
        // downstream sales metrics.
        let computedTotalProductsPrice = 0

        for (const item of args.input) {
          // Keep only the complementos that were actually selected (quantity >=
          // 1). Unselected extras may arrive with quantity null/0 (they exist in
          // the product's catalog list but were not added); including them makes
          // the item validator reject the whole sale. Normalizing here is the
          // backend guard that complements the frontend filter and keeps the
          // persisted sale consistent with the real selection.
          const selectedExtras = Array.isArray(item.dataExtra)
            ? item.dataExtra.filter((ex) => Number(ex?.quantity) >= 1)
            : item.dataExtra
          const normalizedItem = { ...item, dataExtra: selectedExtras }
          const newItem = {
            ProPrice: 0,
            id: context?.User?.id ?? null,
            ...normalizedItem
          }
          const { error } = shoppingCartItemSchema.validate(newItem, { abortEarly: false })
          if (error) {
            await t.rollback()
            return {
              success: false,
              data: null,
              message: 'Validation error',
              errors: error.details.map(e => ({
                message: e.message,
                path: e.path,
                type: e.type,
                context: e.context
              }) as any)
            }
          }
          const qty = Number(item.cantProducts ?? 0)
          if (qty <= 0) {
            await t.rollback()
            return {
              success: false,
              data: null,
              message: `Invalid quantity for pId=${item.pId}`,
              errors: []
            }
          }
          eventsToPublish.push({
            name: eventBusConstants.CHANGE_STOCK_SUBSCRIBER,
            occurredOn: new Date(),
            payload: { pId: item.pId, quantity: qty, idStore }
          })

          const response = await ShoppingServices.create.execute({
            idStore,
            pId: item.pId,
            shoppingCartRefCode: args.shoppingCartRefCode,
            priceProduct: item.priceProduct,
            cantProducts: item.cantProducts,
            idUser: item.idUser,
            comments: item.comments,
            id: args.id,
            refCodePid: item.refCodePid,
            sState: StateShoppingCart.ACTIVE,
            pCodeRef: args.pCodeRef,
            createdAt: new Date(),
            updatedAt: new Date()
          }, t)
          if (response?.success === false) {
            await t.rollback()
            return {
              success: false,
              message: response.message,
              data: null,
              errors: []
            }
          }

          // Use the selected extras (quantity >= 1) so unselected complementos
          // are never persisted as sold nor decremented from inventory.
          const extras = selectedExtras || []
          const dataOptional = item.dataOptional || []
          const soldPid = response?.data?.pId ?? ''
          await ProductExtraServices.bulkCreateExtraSold.execute(extras.map(e => ({
            originalExPid: e.exPid,
            exPid: uuiv4(),
            idStore,
            pCodeRef: args.pCodeRef,
            extraName: e.extraName,
            extraPrice: e.extraPrice,
            pId: soldPid,
            quantity: e.quantity
          })), t)

          // OUT de inventario de complementos: descuenta el stock de cada extra
          // vendido DENTRO de la misma transacción de la venta (atómico). El
          // StockService hace bypass automático cuando el extra no maneja stock,
          // por lo que es seguro invocarlo siempre. Se usa el exPid ORIGINAL del
          // complemento (no el id del registro "sold") para afectar el inventario
          // real. El descuento del producto padre se mantiene en su propio flujo
          // (evento CHANGE_STOCK_SUBSCRIBER), evitando duplicidad.
          for (const extra of extras) {
            const originalExPid = extra?.exPid
            const extraQty = Number(extra?.quantity ?? 0) || qty
            if (!originalExPid || extraQty <= 0) continue
            await extraStock.decrement(originalExPid, extraQty, idStore, t)
          }

          await ProductOptionalServices.bulkCreateProductOptionalAndSubOptional.execute(dataOptional.map(op => ({
            ...op,
            pCodeRef: args.pCodeRef,
            idStore,
            pId: soldPid
          })), t)
        }
        // Resto del flujo (sumPrice, statusOrder, etc.)
        // Use the tenant-scoped service: the global ShoppingTypesServices targets
        // the `public` schema (empty), so its sumPrice always returned 0 and the
        // order was persisted with totalProductsPrice = 0.
        const response = await ShoppingServices.sumPrice.execute(args.shoppingCartRefCode)
        const {
          id,
          tableId,
          change,
          discount,
          valueDelivery,
          payId,
          shoppingCartRefCode,
          pCodeRef,
          tip = 0
        } = args
        const services = StatusOrderTypesServicesTenantFactory(idStore)
        const statusOrderType = await services.findByName.execute(StatusTypeOrder.CONCLUDES)
        const servicesClient = ClientServicesTenantFactory(idStore)
        const client = await servicesClient.findById.execute(idStore)
        const mockSalesStore = {
          id: id ?? client?.data?.cliId,
          tableId,
          idStatus: statusOrderType?.idStatus,
          idStore,
          pSState: StateShoppingCart.ACTIVE,
          valueDelivery,
          shoppingCartRefCode,
          locationUser: '',
          discount,
          tip,
          change,
          pCodeRef,
          totalProductsPrice: response?.data,
          payId,
          pickUp: PickUpMethod.inStorePickup,
          channel: Channel.store,
          createdAt: new Date(),
          updatedAt: new Date()
        } as any

        const { error, value } = statusOrderSchema.validate(mockSalesStore, { abortEarly: false })
        if (error) {
          await t.rollback()
          return {
            success: false,
            data: null,
            message: 'Validation error',
            errors: error.details.map(e => ({
              message: e.message,
              path: e.path,
              type: e.type,
              context: e.context
            }) as any)
          }
        }
        const createResponse = await StatusOrderServices.create.execute(value, t)
        if (createResponse?.success === false) {
          const end = Date.now()
          const durationMs = end - start
          const time = (durationMs / 1000).toFixed(2)
          LogWarning(`RegisterSalesStore executed in ${time} seconds for store ${idStore}`)
          await t.rollback()
          return {
            success: false,
            message: createResponse.message,
            data: createResponse.data as any,
            errors: []
          }
        }

        await t.commit()

        // now publish events after commit (safer for consistency)
        for (const ev of eventsToPublish) {
          try {
            eventBus.publish(ev)
          } catch (err) {
            t.rollback()
            LogDanger(`Failed to publish event ${ev.name}: ${err instanceof Error ? err.message : String(err)}`)
          }
        }

        const end = Date.now()
        const durationMs = end - start
        const time = (durationMs / 1000).toFixed(2)
        LogInfo(`RegisterSalesStore executed in ${time} seconds for store ${idStore}`)
        const newOrder = {
          id: createResponse?.data?.id ?? '',
          idStore: idStore,
          pCodeRef: createResponse?.data?.pCodeRef ?? ''
        }
        if (context.pubsub) {
          context.pubsub.publish(SocketEvents.NEW_STORE_ORDER, { newStoreOrder: { ...newOrder } });
        }
        return createResponse as Maybe<ResponseSalesStore>

      } catch (e) {
        console.log("🚀 ~ e:", e)
        LogDanger(`Error in registerSalesStore: ${e instanceof Error ? e.message : String(e)}`)
        await t.rollback()
        return {
          success: false,
          message: e instanceof Error ? e.message : String(e),
          errors: []
        }
      }
    },
    createOrder: async (_: GraphQLResolveInfo, args: { idStore: string, pdpId: string, totalProductsPrice: number, unidProducts: number }, { pubsub }: { pubsub: PubSub }) => {
      const newOrder = {
        id: Math.random().toString(36).substring(2, 15),
        idStore: args.idStore,
        pCodeRef: Math.random().toString(36).substring(2, 15),
      }
      // Publicar el nuevo pedido en el canal correspondiente
      pubsub.publish(SocketEvents.NEW_STORE_ORDER, { newStoreOrder: { ...newOrder } });
      return newOrder
    }
  }
}

