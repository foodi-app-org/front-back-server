import { Channel } from '../../../../../shared/constants/channel'
import { PickUpMethod } from '../../../../../shared/constants/typePickUp'
import connect from '../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import type { GraphQLContext } from '../../../../../shared/types/context'
import { ShoppingServicesTenantFactory } from '../../../../shopping/infrastructure/services'
import { StoreServicesPublic } from '../../../../store/infrastructure/services'
import { UserServices } from '../../../../user/main/factories/user-services.factory'
import { StatusOrderServicesTenantFactory } from '../../../infrastructure/services'
import {
  computeDiscountAmount,
  computeExtrasTotal,
  computeLineBaseTotal,
  computeNetTotal,
  normalizeSellableExtras
} from '../../../application/order-total'
import { shoppingCartItemSchema, statusOrderSchema } from '../../../infrastructure/validators'
import { StateShoppingCart, type RegisterSalesStoreInput } from '../inputs'
import type { PubSub } from 'graphql-subscriptions'
import { ProductExtraServicesTenantFactory } from '../../../../product_extra/main/factories/product-extra-services.factory'
import { ExtraStockServicesTenantFactory } from '../../../../product_extra/infrastructure/inventory/extra-stock.factory'
import { StockServicesTenantFactory } from '../../../../stock/main/factories/stock.factory'
import { InsufficientStockError, StockValidationError } from '../../../../stock/domain/errors/errors'
import { ProductOptionalServicesTenantFactory } from '../../../../product_optional_extra/main/factories/product-optional-extra-services.factory'
import { v4 as uuidv4 } from 'uuid'
import { StatusOrderTypesServicesTenantFactory } from '@modules/status_order_types/main/factories/status_order_types.factory'
import { StatusTypeOrder } from '@shared/constants/statusTypeOrder'
import { ClientServicesTenantFactory } from '@modules/clients/main/factories/roles-services.factory'
import { ShoppingCartServicesTenantFactory } from '@modules/shopping/main/factories/shopping.factories'
import { StoreServicesTenantFactory } from '@modules/store/main/factories/store-services.factory'
import { convertTimezone } from '@shared/utils/convert-time-zone'
import { computeCartTotals } from 'exact-cart-totals'
import { PaymentMethodServicesFactory } from '@modules/payment_method/main/factories'
import type { Maybe, ResponseSalesStore } from 'generated/graphql'
import { LogDanger, LogInfo, LogWarning } from '@shared/utils/logger.utils'
import { SocketEvents } from '@shared/constants/socket-events'
import { ProductServicesTenantFactory } from '@modules/products/main/factories/products-services.factory'
import { ContextValidator } from '@shared/utils/context-validator'

// Contratos internos: los DTO de dominio y GraphQL no son idénticos.
type SaleResult = {
  success: boolean
  message: string
  data?: unknown
  errors?: unknown[] | null
}

type StatusServices = ReturnType<typeof StatusOrderTypesServicesTenantFactory>
type OrderStatus = NonNullable<Awaited<ReturnType<StatusServices['findById']['execute']>>>

type StoreOrderParent = {
  id?: string | null
  idStore?: string | null
  idStatus?: string | null
  status?: string | null
  statusOrder?: Partial<OrderStatus> | null
  dataValues?: {
    id?: string | null
    idStore?: string | null
    idStatus?: string | null
    status?: string | null
  }
}

type SaleLineInput = RegisterSalesStoreInput['input'][number]
type ShoppingServices = ReturnType<typeof ShoppingCartServicesTenantFactory>
type CartLine = NonNullable<Awaited<ReturnType<ShoppingServices['getAllByRefCode']['execute']>>>[number]

type SoldExtra = {
  extraPrice?: number | string | null
  quantity?: number | string | null
  newExtraPrice?: number | string | null
  [field: string]: unknown
}

type SoldProduct = {
  dataExtra?: SoldExtra[] | null
  dataOptional?: Record<string, unknown>[] | null
  [field: string]: unknown
}

type CartLineWithProduct = CartLine & { products?: SoldProduct | null }

type DiscountLike = {
  type?: string | null
  value?: number | string | null
}

type GetAllSalesArgs = {
  idStore?: string
  search?: string
  min?: number
  max?: number
  fromDate?: string
  toDate?: string
  channel?: number
}

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error)

const failure = (message: string, errors: unknown[] = []): SaleResult => ({
  success: false,
  message,
  data: null,
  errors
})

// Mantiene el contrato de salida utilizado por el schema actual. Los DTO
// devueltos por los servicios no son tipos GraphQL generados.
const toGraphQLResponse = (result: SaleResult): Maybe<ResponseSalesStore> =>
  result as unknown as Maybe<ResponseSalesStore>

const existingSale = (data: unknown): SaleResult => ({
  success: true,
  message: 'Sale already registered',
  data,
  errors: []
})

/** Lanzar este error dentro de la transacción garantiza el rollback. */
class SaleAbort extends Error {
  constructor(
    readonly response: SaleResult,
    readonly recheckIdempotency = false
  ) {
    super(response.message)
    this.name = 'SaleAbort'
  }
}

const isUniqueViolation = (error: unknown): boolean => {
  const candidate = error as {
    name?: string
    code?: string
    parent?: { code?: string }
    original?: { code?: string }
  } | null

  return candidate?.name === 'SequelizeUniqueConstraintError' ||
    candidate?.code === '23505' ||
    candidate?.parent?.code === '23505' ||
    candidate?.original?.code === '23505' ||
    /unique constraint|duplicate key|already exists/i.test(errorMessage(error))
}

const toFiniteNumber = (value: unknown): number => {
  const number = Number(value ?? 0)
  return Number.isFinite(number) ? number : 0
}

/** Compatibilidad con descuentos históricos: número, objeto y JSON. */
const resolveDiscountPercent = (raw: unknown): number => {
  if (raw == null) return 0
  if (typeof raw === 'number') return toFiniteNumber(raw)
  if (typeof raw === 'object') {
    return toFiniteNumber((raw as { value?: unknown }).value)
  }
  if (typeof raw !== 'string') return 0

  const value = raw.trim()
  if (!value || value === '[object Object]') return 0
  const numeric = Number(value)
  if (Number.isFinite(numeric)) return numeric

  try {
    const parsed: unknown = JSON.parse(value)
    // No se aceptan JSON que solo envuelven otras cadenas indefinidamente.
    return typeof parsed === 'string' ? toFiniteNumber(parsed) : resolveDiscountPercent(parsed)
  } catch {
    return 0
  }
}

const mapShoppingCart = (cart: CartLine): CartLineWithProduct & {
  products: SoldProduct & {
    ExtProductFoodsAll?: SoldExtra[]
    ExtProductFoodOptional?: Record<string, unknown>[]
  }
} => {
  // El repositorio incluye asociaciones Sequelize y devuelve objetos planos;
  // su firma de dominio todavía no declara la propiedad `products`.
  const line = cart as CartLineWithProduct
  const product = line.products
  return {
    ...line,
    products: {
      ...product,
      ExtProductFoodsAll: product?.dataExtra?.map(extra => ({
        ...extra,
        newExtraPrice: extra.newExtraPrice ??
          (toFiniteNumber(extra.extraPrice) * toFiniteNumber(extra.quantity))
      })),
      ExtProductFoodOptional: product?.dataOptional?.map(optional => ({ ...optional }))
    }
  }
}

const getSaleTotals = (shopping: CartLine[], discount: unknown) => {
  // Mantener las opciones y el formato existentes de exact-cart-totals evita
  // alterar el contrato de lectura y la reimpresión en este refactor.
  const calculated = computeCartTotals(
    shopping as unknown as Parameters<typeof computeCartTotals>[0],
    {
      currencySymbol: '$',
      includeExtras: true,
      globalDiscountPercent: resolveDiscountPercent(discount),
      includeBreakdownByStore: false,
      includeLines: false,
      formatNumbers: true,
      lang: 'es'
    }
  ) as unknown as { totals?: unknown[] } | null

  return Array.isArray(calculated?.totals) ? calculated.totals : []
}

const mapValidationErrors = (details: Array<{
  message: string
  path: Array<string | number>
  type: string
  context?: unknown
}>) => details.map(({ message, path, type, context }) => ({
  message,
  path,
  type,
  context
}))

/** Valida todas las líneas antes de tomar locks de inventario. */
const prepareLines = (items: SaleLineInput[], context: GraphQLContext) => {
  return items.map(item => {
    const selectedExtras = Array.isArray(item.dataExtra)
      ? item.dataExtra.filter(extra => Number(extra?.quantity) >= 1)
      : item.dataExtra
    const normalizedItem = { ...item, dataExtra: selectedExtras }
    const { error } = shoppingCartItemSchema.validate({
      ProPrice: 0,
      id: context.User?.id ?? null,
      ...normalizedItem
    }, { abortEarly: false })

    if (error) {
      throw new SaleAbort(failure('Validation error', mapValidationErrors(error.details)))
    }

    const quantity = Number(item.cantProducts ?? 0)
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new SaleAbort(failure(`Invalid quantity for pId=${item.pId}`))
    }

    return {
      item,
      quantity,
      isFree: item.free === true,
      sellableExtras: normalizeSellableExtras(selectedExtras, quantity)
    }
  })
}

const publishSale = async (
  context: GraphQLContext,
  order: { id: string; idStore: string; pCodeRef: string }
): Promise<void> => {
  if (!context.pubsub) return

  try {
    await context.pubsub.publish(SocketEvents.NEW_STORE_ORDER, {
      newStoreOrder: order
    })
  } catch (error) {
    // La venta ya se confirmó: una notificación fallida no cambia su resultado.
    LogWarning(`NEW_STORE_ORDER publish failed for ${order.pCodeRef}: ${errorMessage(error)}`)
  }
}

export const orderResolvers = {
  Type: {
    StoreOrders: {
      getUser: async (parent: StoreOrderParent, _args: Record<string, unknown>, context: GraphQLContext) => {
        const idUser = parent?.dataValues?.id ?? context.User?.id
        return idUser ? UserServices.findById.execute(idUser) : null
      },

      getOneStore: async (parent: StoreOrderParent, _args: Record<string, unknown>, _context: GraphQLContext) => {
        const idStore = parent?.dataValues?.idStore
        return idStore ? StoreServicesPublic.findById.execute(idStore) : null
      },

      statusOrder: async (parent: StoreOrderParent, _args: Record<string, unknown>, context: GraphQLContext) => {
        const idStore = context.restaurant
        if (!idStore) return null

        // getOneSalesStore ya cargó el estado completo; no repetir la consulta.
        if (parent.statusOrder?.idStatus && parent.statusOrder?.name) {
          return parent.statusOrder
        }

        const idStatus = parent.idStatus ?? parent.dataValues?.idStatus
        const name = parent.statusOrder?.name?.trim()
        if (!idStatus && !name) return null

        const services = StatusOrderTypesServicesTenantFactory(idStore)
        if (idStatus) return services.findById.execute(idStatus)
        return name ? services.findByName.execute(name) : null
      }
    }
  },

  Query: {
    getOneSalesStore: async (_parent: unknown, args: { pCodeRef?: string | null }, context: GraphQLContext) => {
      const pCodeRef = args.pCodeRef
      if (!pCodeRef) {
        return failure('Code sale reference is required', [{
          message: 'Code sale reference is required',
          path: ['pCodeRef'],
          type: 'required',
          context: { label: 'pCodeRef', key: 'pCodeRef' }
        }])
      }

      const idStore = new ContextValidator(context).validateUserSession()
      if (!idStore) return failure('Store not found')

      const orderServices = StatusOrderServicesTenantFactory(idStore)
      const response = await orderServices.getOneByCodeRef.execute(pCodeRef)
      if (!response?.success || !response.data) {
        throw new Error(response?.message ?? 'Error al obtener la venta')
      }

      const {
        id: clientId,
        idStatus,
        payId,
        createdAt,
        shoppingCartRefCode,
        discount,
        discountType,
        discountValue,
        discountAmount,
        netTotal,
        totalProductsPrice: headerTotalProductsPrice
      } = response.data

      const shoppingServices = ShoppingCartServicesTenantFactory(idStore)
      const storeServices = StoreServicesTenantFactory(idStore)
      const clientServices = ClientServicesTenantFactory(idStore)
      const statusServices = StatusOrderTypesServicesTenantFactory(idStore)
      const paymentServices = PaymentMethodServicesFactory(idStore)

      // Todas estas lecturas dependen de la cabecera, pero no entre sí.
      const [shopping, store, client, paymentMethod, statusOrder] = await Promise.all([
        shoppingServices.getAllByRefCode.execute(String(shoppingCartRefCode), pCodeRef),
        storeServices.findById.execute(idStore),
        clientServices.findById.execute(String(clientId || idStore)),
        payId ? paymentServices.getOneById.execute(String(payId)) : Promise.resolve(null),
        idStatus ? statusServices.findById.execute(idStatus) : Promise.resolve(null)
      ])

      const lines = shopping ?? []
      const sale = {
        createdAt: convertTimezone(createdAt as Date),
        store,
        client: client?.data,
        shoppingCarts: shopping?.map(mapShoppingCart),
        pCodeRef,
        shoppingCartRefCode,
        info: { pCodeRef },
        paymentMethod,
        statusOrder: statusOrder ?? null,
        discount,
        discountType: discountType ?? null,
        discountValue: discountValue != null ? Number(discountValue) : null,
        discountAmount: discountAmount != null ? Number(discountAmount) : null,
        netTotal: netTotal != null
          ? Number(netTotal)
          : (headerTotalProductsPrice != null ? Number(headerTotalProductsPrice) : null),
        totals: getSaleTotals(lines, discount)
      }

      return { success: true, message: response.message, data: sale }
    },

    getAllSalesStore: async (_parent: unknown, args: GetAllSalesArgs, context: GraphQLContext) => {
      const idStore = context.restaurant ?? args.idStore ?? ''
      const services = StatusOrderServicesTenantFactory(idStore)
      const response = await services.getAllByStatusType.execute({
        search: args.search,
        min: args.min,
        max: args.max,
        fromDate: args.fromDate,
        toDate: args.toDate,
        channel: args.channel
      })
      return response?.data ?? []
    }
  },

  Mutation: {
    registerSalesStore: async (_parent: unknown, args: RegisterSalesStoreInput, context: GraphQLContext): Promise<Maybe<ResponseSalesStore>> => {
      const startedAt = Date.now()
      // Se conserva el fallback legado. El tenant de sesión tiene prioridad.
      const idStore = context.restaurant ?? args.idStore
      if (!idStore) return toGraphQLResponse(failure('Store not found'))

      const orderServices = StatusOrderServicesTenantFactory(idStore)
      let creatingHeader = false

      try {
        const storeExists = await StoreServicesPublic.findById.execute(idStore)
        if (!storeExists) return toGraphQLResponse(failure('Store not found'))

        if (!Array.isArray(args.input) || args.input.length === 0) {
          return toGraphQLResponse(failure('No products to add'))
        }
        if (typeof args.pCodeRef !== 'string' || !args.pCodeRef.trim()) {
          return toGraphQLResponse(failure('Code sale reference is required'))
        }

        // La restricción UNIQUE del tenant sigue siendo la garantía final.
        const previous = await orderServices.getOneByCodeRef.execute(args.pCodeRef)
        if (previous?.success && previous.data) {
          return toGraphQLResponse(existingSale(previous.data))
        }

        // Validaciones de entrada antes de abrir la transacción.
        
        const lines = prepareLines(args.input, context)
        const statusServices = StatusOrderTypesServicesTenantFactory(idStore)
        const clientServices = ClientServicesTenantFactory(idStore)
        const [statusOrderType, client] = await Promise.all([
          statusServices.findByName.execute(StatusTypeOrder.CONCLUDES),
          clientServices.findById.execute(idStore)
        ])

        const productServices = ProductServicesTenantFactory(idStore)
        const shoppingServices = ShoppingServicesTenantFactory(idStore)
        const extraServices = ProductExtraServicesTenantFactory(idStore)
        const optionalServices = ProductOptionalServicesTenantFactory(idStore)
        const extraStock = ExtraStockServicesTenantFactory(idStore, context.pubsub)
        const parentStock = StockServicesTenantFactory(idStore, context.pubsub)

        // Transacción administrada: cualquier excepción revierte TODA la venta.
        // No ejecutar escrituras concurrentes sobre la misma transacción.
        const created = await connect().transaction(async transaction => {
          let computedTotalProductsPrice = 0

          for (const { item, quantity, isFree, sellableExtras } of lines) {
            const product = await productServices.findById.execute(String(item.pId))
            if (!product?.data) {
              throw new SaleAbort(failure(`Product with id ${item.pId} not found`))
            }

            // La fuente de precio es el catálogo en el backend; no el cliente.
            const rawUnitPrice = Number(product.data.ProPrice)
            const unitPrice = Number.isFinite(rawUnitPrice) ? rawUnitPrice : 0
            const effectivePrice = isFree ? 0 : unitPrice

            await parentStock.decrement(item.pId, quantity, idStore, transaction)

            for (const extra of sellableExtras) {
              const originalExPid = extra.exPid
              const extraQty = Number(extra.quantity ?? 0)
              if (!originalExPid || extraQty <= 0) continue
              await extraStock.decrement(originalExPid, extraQty, idStore, transaction)
            }

            computedTotalProductsPrice += computeLineBaseTotal({
              priceProduct: effectivePrice,
              cantProducts: quantity,
              free: isFree
            }) + (isFree ? 0 : computeExtrasTotal(sellableExtras))

            const timestamp = new Date()
            const cart = await shoppingServices.create.execute({
              idStore,
              pId: item.pId,
              shoppingCartRefCode: args.shoppingCartRefCode,
              priceProduct: effectivePrice,
              free: isFree,
              cantProducts: item.cantProducts,
              idUser: item.idUser,
              comments: item.comments,
              id: args.id,
              refCodePid: item.refCodePid,
              sState: StateShoppingCart.ACTIVE,
              pCodeRef: args.pCodeRef,
              createdAt: timestamp,
              updatedAt: timestamp
            }, transaction)

            if (!cart?.success || !cart.data?.pId) {
              throw new SaleAbort(failure(cart?.message ?? 'Failed to create shopping cart line'))
            }

            // El pId es el snapshot vendido, no necesariamente el pId del catálogo.
            const soldPid = cart.data.pId
            if (sellableExtras.length > 0) {
              const extrasResult = await extraServices.bulkCreateExtraSold.execute(
                sellableExtras.map(extra => ({
                  originalExPid: extra.exPid,
                  exPid: uuidv4(),
                  idStore,
                  pCodeRef: args.pCodeRef,
                  extraName: extra.extraName,
                  extraPrice: isFree ? 0 : extra.extraPrice,
                  pId: soldPid,
                  quantity: extra.quantity
                })),
                transaction
              )
              if (!extrasResult?.success) {
                throw new SaleAbort(failure(extrasResult?.message ?? 'Failed to create sold extras'))
              }
            }

            const optionals = item.dataOptional || []
            if (optionals.length > 0) {
              const optionalsResult = await optionalServices.bulkCreateProductOptionalAndSubOptional.execute(
                optionals.map(optional => ({
                  ...optional,
                  pCodeRef: args.pCodeRef,
                  idStore,
                  pId: soldPid
                })),
                transaction
              )
              if (!optionalsResult?.success) {
                throw new SaleAbort(failure(optionalsResult?.message ?? 'Failed to create sold optionals'))
              }
            }
          }

          const {
            id, tableId, change, discount, valueDelivery, payId,
            shoppingCartRefCode, pCodeRef, tip = 0
          } = args

          // Se conserva la fórmula y la representación de descuentos de escritura.
          const discountInput = (discount ?? null) as unknown as DiscountLike | null
          const discountAmount = computeDiscountAmount(discountInput, computedTotalProductsPrice)
          const netTotal = computeNetTotal(computedTotalProductsPrice, discountAmount)
          const discountType = discountInput?.type === 'AMOUNT'
            ? 'AMOUNT'
            : (discountInput ? 'PERCENT' : null)
          const discountValue = discountInput && Number.isFinite(Number(discountInput.value))
            ? Math.max(0, Math.round(Number(discountInput.value)))
            : null

          const timestamp = new Date()
          const sale = {
            id: id ?? client?.data?.cliId,
            tableId,
            idStatus: statusOrderType?.idStatus,
            idStore,
            pSState: StateShoppingCart.ACTIVE,
            valueDelivery,
            shoppingCartRefCode,
            locationUser: '',
            discount,
            discountType,
            discountValue,
            discountAmount,
            netTotal,
            tip,
            change,
            pCodeRef,
            totalProductsPrice: computedTotalProductsPrice,
            payId,
            pickUp: PickUpMethod.inStorePickup,
            channel: Channel.store,
            createdAt: timestamp,
            updatedAt: timestamp
          }

          const { error, value } = statusOrderSchema.validate(sale, { abortEarly: false })
          if (error) {
            throw new SaleAbort(failure('Validation error', mapValidationErrors(error.details)))
          }

          creatingHeader = true
          const result = await orderServices.create.execute(value, transaction)
          if (!result?.success || !result.data) {
            const message = result?.message ?? 'Failed to create order status type'
            throw new SaleAbort({
              success: false,
              message,
              data: result?.data ?? null,
              errors: []
            }, isUniqueViolation(message))
          }
          return result
        })

        // Este punto solo se alcanza después de confirmar la transacción.
        await publishSale(context, {
          id: created.data?.id ?? '',
          idStore,
          pCodeRef: created.data?.pCodeRef ?? ''
        })
        LogInfo(`RegisterSalesStore executed in ${((Date.now() - startedAt) / 1000).toFixed(2)} seconds for store ${idStore}`)
        return toGraphQLResponse(created)
      } catch (error) {
        // El catch está FUERA de la transacción administrada. El rollback ya
        // fue gestionado por Sequelize antes de cualquier relectura del ganador.
        const mayBeRetry =
          (error instanceof SaleAbort && error.recheckIdempotency) ||
          (creatingHeader && isUniqueViolation(error)) ||
          error instanceof InsufficientStockError

        if (mayBeRetry) {
          const winner = await orderServices.getOneByCodeRef.execute(args.pCodeRef)
          if (winner?.success && winner.data) {
            LogInfo(`registerSalesStore: retry resolved for ${args.pCodeRef}`)
            return toGraphQLResponse(existingSale(winner.data))
          }
        }

        if (error instanceof SaleAbort) {
          return toGraphQLResponse(error.response)
        }

        if (error instanceof InsufficientStockError) {
          const { pId, requested, available } = error.payload
          LogWarning(`registerSalesStore: stock insuficiente pId=${pId} pedido=${requested} disponible=${available}`)
          return toGraphQLResponse(failure('Insufficient stock', [{
            message: `Stock insuficiente para el producto ${pId}. Solicitado: ${requested}, disponible: ${available}.`,
            path: ['input', 'pId'],
            type: 'stock.insufficient',
            context: {
              key: 'pId',
              label: 'pId',
              value: requested,
              limit: available
            }
          }]))
        }

        if (error instanceof StockValidationError) {
          LogDanger(`registerSalesStore: error de validación de stock: ${error.message}`)
          return toGraphQLResponse(failure(error.message, [{
            message: error.message,
            path: ['input', 'pId'],
            type: 'stock.validation'
          }]))
        }

        LogDanger(`Error in registerSalesStore: ${errorMessage(error)}`)
        return toGraphQLResponse(failure(errorMessage(error)))
      }
    },

    createOrder: async (
      _parent: unknown,
      args: { idStore: string; pdpId: string; totalProductsPrice: number; unidProducts: number },
      { pubsub }: { pubsub: PubSub }
    ) => {
      // Mantiene el comportamiento de esta operación legado: solo evento.
      const newOrder = {
        id: Math.random().toString(36).substring(2, 15),
        idStore: args.idStore,
        pCodeRef: Math.random().toString(36).substring(2, 15)
      }
      // No hay escritura en esta operación; conserva la entrega best-effort.
      try {
        await pubsub.publish(SocketEvents.NEW_STORE_ORDER, { newStoreOrder: newOrder })
      } catch (error) {
        LogWarning(`NEW_STORE_ORDER publish failed: ${errorMessage(error)}`)
      }
      return newOrder
    }
  }
}
