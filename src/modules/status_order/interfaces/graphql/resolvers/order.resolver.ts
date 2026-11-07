import { GraphQLResolveInfo } from 'graphql'

import { Channel } from '../../../../../shared/constants/channel'
import { PickUpMethod } from '../../../../../shared/constants/typePickUp'
import connect from '../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { GraphQLContext } from '../../../../../shared/types/context'
import { ShoppingServicesTenantFactory } from '../../../../shopping/infrastructure/services'
import { StoreServicesPublic } from '../../../../store/infrastructure/services'
import { UserServices } from '../../../../user/main/factories/user-services.factory'
import { StatusOrderServicesTenantFactory } from '../../../infrastructure/services'
import { computeExtrasTotal, computeLineBaseTotal, normalizeSellableExtras } from '../../../application/order-total'
import { shoppingCartItemSchema, statusOrderSchema } from '../../../infrastructure/validators'
import { RegisterSalesStoreInput, StateShoppingCart } from '../inputs'
import { PubSub } from 'graphql-subscriptions'
import { ProductExtraServicesTenantFactory } from '../../../../product_extra/main/factories/product-extra-services.factory'
import { ExtraStockServicesTenantFactory } from '../../../../product_extra/infrastructure/inventory/extra-stock.factory'
import { StockServicesTenantFactory } from '../../../../stock/main/factories/stock.factory'
import { InsufficientStockError, StockValidationError } from '../../../../stock/domain/errors/errors'
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
      const start = Date.now()
      const idStore = context.restaurant ?? args.idStore

        // 0. Validaciones previas (fuera de la transacción)
        const storeExists = await StoreServicesPublic.findById.execute(idStore)
        if (!storeExists) {
          return {
            success: false,
            message: 'Store not found',
            errors: []
          }
        }

        if (!Array.isArray(args.input) || args.input.length === 0) {
          return {
            success: false,
            message: 'No products to add',
            data: null,
            errors: []
          }
        }

      // 1. Instanciar servicios una sola vez
      const ShoppingServices = ShoppingServicesTenantFactory(idStore)
      const StatusOrderServices = StatusOrderServicesTenantFactory(idStore)
      const ProductExtraServices = ProductExtraServicesTenantFactory(idStore)
      const ProductOptionalServices = ProductOptionalServicesTenantFactory(idStore)
      const extraStock = ExtraStockServicesTenantFactory(idStore, context.pubsub)
      // Servicio de stock para el producto PADRE: hace lock FOR UPDATE, valida
      // `manageStock` (bypass cuando el producto no se maneja por inventario) y
      // lanza InsufficientStockError cuando no hay existencias suficientes.
      const parentStock = StockServicesTenantFactory(idStore, context.pubsub)

      // 2. IDEMPOTENCIA: `pCodeRef` es la clave de negocio de la venta y la envía
      // el cliente. Si ya existe una orden con ese código (reintento por red,
      // doble click o retry del cliente) devolvemos la venta existente SIN
      // reinsertar líneas ni volver a descontar stock. Esta comprobación va
      // ANTES de abrir la transacción y de tocar inventario, de modo que un
      // reintento es un no-op seguro. La columna `pCodeRef` está indexada y la
      // lectura es O(1), por lo que no penaliza el camino de alta concurrencia.
      const existingOrder = await StatusOrderServices.getOneByCodeRef.execute(args.pCodeRef)
      if (existingOrder?.success && existingOrder?.data) {
        LogInfo(`registerSalesStore: pCodeRef ${args.pCodeRef} ya existe, respuesta idempotente`)
        return {
          success: true,
          message: 'Sale already registered',
          data: existingOrder.data as any,
          errors: []
        }
      }

      const sequelize = connect()
      const t = await sequelize.transaction()
      // Punto ÚNICO de cierre de la transacción: el `finally` hace rollback a
      // menos que la venta se haya confirmado (`committed = true`). Así es
      // imposible llamar a rollback dos veces o hacer rollback después del
      // commit (eso lanzaría "Transaction cannot be rolled back because it has
      // been finished"). Las salidas tempranas y el catch solo hacen `return` /
      // registran el error; el `finally` se encarga de liberar la transacción y
      // los locks FOR UPDATE.
      let committed = false
      try {

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
            return {
              success: false,
              data: null,
              message: `Invalid quantity for pId=${item.pId}`,
              errors: []
            }
          }

          // OUT de inventario del producto PADRE DENTRO de la transacción de la
          // venta (atómico). Antes se publicaba un evento CHANGE_STOCK_SUBSCRIBER
          // DESPUÉS del commit, por lo que la factura se creaba aunque el
          // producto ya no tuviera stock y el descuento ocurría fuera de la
          // transacción (sin lock ni bloqueo de la venta). Ahora el descuento:
          //  - toma un lock FOR UPDATE sobre la fila del producto (serializa
          //    ventas concurrentes del mismo producto y soporta escrituras
          //    masivas sin sobreventa),
          //  - hace bypass automático si el producto NO se maneja por stock
          //    (manageStock = false), por lo que es seguro invocarlo siempre,
          //  - lanza InsufficientStockError si falta inventario, lo que aborta
          //    y revierte TODA la factura (no se crea la venta si al menos un
          //    producto manejado por stock no tiene existencias).
          await parentStock.decrement(item.pId, qty, idStore, t)

          // Normaliza los complementos vendibles ANTES de contabilizarlos.
          // Cada extra lleva una `quantity` normalizada (>= 1, con fallback a la
          // cantidad del producto padre cuando llega null/0 tras el filtro) que
          // es la ÚNICA cantidad usada en los tres puntos del flujo: el importe
          // del total, el registro `products_extras_sold` y el descuento de
          // inventario. Así no hay divergencia entre lo que se cobra, lo que se
          // marca como vendido y lo que sale de stock (evita doble o distinta
          // contabilización).
          const sellableExtras = normalizeSellableExtras(selectedExtras, qty)

          // OUT de inventario de complementos ANTES de acumular su importe y de
          // persistirlos como vendidos. El descuento es la compuerta que aplica
          // la regla de negocio: el StockService hace bypass cuando el extra NO
          // maneja inventario (manageStock = false) -> se vende y se contabiliza
          // como hasta ahora; y cuando `manageStock = true` sin stock suficiente
          // lanza InsufficientStockError, lo que revierte TODA la venta (el
          // extra sin stock NUNCA se cuenta ni se marca como vendido). Se usa el
          // exPid ORIGINAL del complemento (no el id del registro "sold") para
          // afectar el inventario real. El producto padre ya se descontó arriba
          // en esta misma transacción.
          for (const extra of sellableExtras) {
            const originalExPid = extra?.exPid
            const extraQty = Number(extra?.quantity ?? 0)
            if (!originalExPid || extraQty <= 0) continue
            await extraStock.decrement(originalExPid, extraQty, idStore, t)
          }

          // Accumulate this line's contribution to the order total using the
          // SAME definition the metrics reconstruct from the detail:
          //   base  = priceProduct * cantProducts  (shopping_carts)
          //   extra = sum(extraPrice * quantity)   (products_extras_sold)
          // Discounts, tips and delivery are intentionally excluded (they have
          // their own columns and were never part of `totalProductsPrice`). The
          // math lives in a pure, unit-tested helper so the header always
          // matches findTotalSales / countSalesAmountToday. Los extras ya pasaron
          // el descuento de inventario, por lo que un complemento con
          // manageStock=true y sin stock jamás llega hasta aquí (la venta se
          // revirtió), garantizando la regla "solo se cuentan los extras
          // efectivamente vendidos".
          computedTotalProductsPrice += computeLineBaseTotal({
            priceProduct: item.priceProduct,
            cantProducts: qty
          }) + computeExtrasTotal(sellableExtras)

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
            return {
              success: false,
              message: response.message,
              data: null,
              errors: []
            }
          }

          // Persist the sold complementos using the SAME `sellableExtras`
          // (quantity normalizada) que ya se descontó de inventario y que se
          // acumuló en el total. El inventario se descontó arriba, por lo que
          // los complementos que lleguen aquí son exactamente los que se
          // vendieron. Se usa la misma `quantity` normalizada para que el
          // registro `products_extras_sold`, el importe del total y el OUT de
          // stock sean idénticos (sin doble contabilización ni divergencias).
          const dataOptional = item.dataOptional || []
          const soldPid = response?.data?.pId ?? ''
          await ProductExtraServices.bulkCreateExtraSold.execute(sellableExtras.map(e => ({
            originalExPid: e.exPid,
            exPid: uuiv4(),
            idStore,
            pCodeRef: args.pCodeRef,
            extraName: e.extraName,
            extraPrice: e.extraPrice,
            pId: soldPid,
            quantity: e.quantity
          })), t)

          await ProductOptionalServices.bulkCreateProductOptionalAndSubOptional.execute(dataOptional.map(op => ({
            ...op,
            pCodeRef: args.pCodeRef,
            idStore,
            pId: soldPid
          })), t)
        }
        // Resto del flujo (statusOrder, etc.)
        // The order total is now computed in-flight from the line items inside
        // this transaction (base + extras), so it is always correct even for
        // extra-only sales. The previous `ShoppingServices.sumPrice` call ran
        // outside the tx (never saw the just-inserted rows) and ignored extras,
        // which is why orders were persisted with totalProductsPrice = 0.
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
          totalProductsPrice: computedTotalProductsPrice,
          payId,
          pickUp: PickUpMethod.inStorePickup,
          channel: Channel.store,
          createdAt: new Date(),
          updatedAt: new Date()
        } as any

        const { error, value } = statusOrderSchema.validate(mockSalesStore, { abortEarly: false })
        if (error) {
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
          return {
            success: false,
            message: createResponse.message,
            data: createResponse.data as any,
            errors: []
          }
        }

        await t.commit()
        committed = true

        // El descuento de inventario (producto padre + complementos) ya se
        // realizó dentro de la transacción recién confirmada, por lo que no se
        // publican eventos de stock post-commit (se eliminó el flujo
        // CHANGE_STOCK_SUBSCRIBER para evitar un doble descuento).

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
        // No se hace rollback aquí: el `finally` revierte la transacción porque
        // `committed` sigue en false. Esto garantiza un único punto de cierre y
        // libera los locks FOR UPDATE tomados sobre las filas de producto.

        // CARRERA CONCURRENTE: dos requests con el MISMO `pCodeRef` pueden
        // pasar ambos el guard de idempotencia (lectura previa) y competir por
        // el INSERT. El índice UNIQUE sobre `pCodeRef` hace que el segundo
        // INSERT falle con un error de unicidad. Eso NO es un fallo real: la
        // venta ya quedó registrada por el request ganador, así que releemos la
        // orden existente y devolvemos una respuesta idempotente de éxito.
        const errName = (e as { name?: string })?.name ?? ''
        const errMsg = e instanceof Error ? e.message.toLowerCase() : String(e).toLowerCase()
        const isUniqueViolation =
          errName === 'SequelizeUniqueConstraintError' ||
          errMsg.includes('unique') ||
          errMsg.includes('duplicate')
        if (isUniqueViolation) {
          const winner = await StatusOrderServices.getOneByCodeRef.execute(args.pCodeRef)
          if (winner?.success && winner?.data) {
            LogInfo(`registerSalesStore: carrera resuelta por índice único, respuesta idempotente para pCodeRef ${args.pCodeRef}`)
            return {
              success: true,
              message: 'Sale already registered',
              data: winner.data as any,
              errors: []
            }
          }
        }

        // Stock insuficiente de un producto manejado por inventario: la venta
        // completa se bloquea y el front recibe un `errors[]` estructurado para
        // informar al usuario exactamente qué producto se quedó sin stock
        // (pId, cantidad pedida y disponible). Mismo contrato de error que el
        // resto de validaciones (path/type/context) para que el cliente lo
        // renderice de forma uniforme.
        if (e instanceof InsufficientStockError) {
          const { pId, requested, available } = e.payload
          LogWarning(`registerSalesStore: stock insuficiente pId=${pId} pedido=${requested} disponible=${available}`)
          return {
            success: false,
            data: null,
            message: 'Insufficient stock',
            errors: [
              {
                message: `Stock insuficiente para el producto ${pId}. Solicitado: ${requested}, disponible: ${available}.`,
                path: ['input', 'pId'],
                type: 'stock.insufficient',
                context: {
                  key: 'pId',
                  label: 'pId',
                  // `value` está tipado como `Int` en el schema GraphQL
                  // (contextError.value: Int). El `pId` es un UUID string, así
                  // que meterlo aquí hacía fallar la serialización con
                  // "Int cannot represent non-integer value". Enviamos la
                  // cantidad solicitada (un entero) en `value`, que es lo que
                  // tiene sentido numérico; el pId sigue disponible en
                  // message/key/label.
                  value: requested,
                  limit: available
                }
              }
            ] as any
          }
        }

        if (e instanceof StockValidationError) {
          LogDanger(`registerSalesStore: error de validación de stock: ${e.message}`)
          return {
            success: false,
            data: null,
            message: e.message,
            errors: [
              {
                message: e.message,
                path: ['input', 'pId'],
                type: 'stock.validation'
              }
            ] as any
          }
        }

        LogDanger(`Error in registerSalesStore: ${e instanceof Error ? e.message : String(e)}`)
        return {
          success: false,
          message: e instanceof Error ? e.message : String(e),
          errors: []
        }
      } finally {
        // Punto ÚNICO de cierre: si la venta no se confirmó (salida temprana o
        // excepción), revertimos. El guard `committed` evita hacer rollback
        // sobre una transacción ya finalizada tras el commit. Se envuelve en
        // try/catch para que un fallo del propio rollback no enmascare la
        // respuesta que ya calculamos.
        if (!committed) {
          try {
            await t.rollback()
          } catch (rollbackError) {
            LogDanger(`registerSalesStore: rollback falló: ${rollbackError instanceof Error ? rollbackError.message : String(rollbackError)}`)
          }
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

