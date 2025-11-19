import { GraphQLResolveInfo } from 'graphql'

import { Channel } from '../../../../../shared/constants/channel'
import { PickUpMethod } from '../../../../../shared/constants/typePickUp'
import connect from '../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { GraphQLContext } from '../../../../../shared/types/context'
import { ShoppingServicesTenantFactory, ShoppingTypesServices } from '../../../../shopping/infrastructure/services'
import { StoreServicesPublic } from '../../../../store/infrastructure/services'
import { UserServices } from '../../../../user/main/factories/user-services.factory'
import { StatusOrderServicesTenantFactory } from '../../../infrastructure/services'
import { shoppingCartItemSchema, statusOrderSchema } from '../../../infrastructure/validators'
import { RegisterSalesStoreInput, StateShoppingCart } from '../inputs'
import { NEW_STORE_ORDER } from '../../../../../ws-schema'
import { PubSub } from 'graphql-subscriptions'
import { ProductExtraServicesTenantFactory } from '../../../../product_extra/main/factories/product-extra-services.factory'
import { ProductOptionalServicesTenantFactory } from '../../../../product_optional_extra/main/factories/product-optional-extra-services.factory'
import { v4 as uuiv4 } from 'uuid'
import { StatusOrderTypesServicesTenantFactory } from '@modules/status_order_types/main/factories/status_order_types.factory'
import { StatusTypeOrder } from '@shared/constants/statusTypeOrder'
import { ClientServicesTenantFactory } from '@modules/clients/main/factories/roles-services.factory'
import { ShoppingCartServicesTenantFactory } from '@modules/shopping/main/factories/shopping.factories'
import { StoreServicesTenantFactory } from '@modules/store/main/factories/store-services.factory'
import { convertTimezone } from '@shared/utils/convert-time-zone'
import { computeCartTotals } from 'exact-cart-totals'

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
      console.log("🚀 ~ response:", response)
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

      const shoppingResponse = shopping?.map(cart => {
        return {
          ...cart,
          // @ts-ignore
          products: {
            // @ts-ignore
            ...cart.products,
            // @ts-ignore
            ExtProductFoodsAll: cart.products?.dataExtra?.map((extras: any) => {
              return {
                ...extras,
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
      const totals = computeCartTotals(shopping as any[], {
        currencySymbol: '$',
        includeExtras: true,
        globalDiscountPercent: discount ?? 0,
      })
      const totalsArray = Object.entries(totals).map(([key, value]) => ({
        name: key,
        value: typeof value === 'number' ? value : 0
      }))

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
        statusOrder: statusOrderType ?? null,
        discount,
        totals: totalsArray
      }
      return {
        success: true,
        message,
        data: sale
      }
    },

    getAllSalesStore: async (_: GraphQLResolveInfo, _args: Record<string, unknown>, context: GraphQLContext) => {
      const idStore = context.restaurant ?? ''
      const services = StatusOrderServicesTenantFactory(idStore)
      const response = await services.getAllByStatusType.execute()
      return response?.data ?? []
    }
  },
  Mutation: {
    registerSalesStore: async (_: GraphQLResolveInfo, args: RegisterSalesStoreInput, context: GraphQLContext) => {
      const start = Date.now()
      const idStore = context.restaurant ?? args.idStore
      const sequelize = connect()
      const t = await sequelize.transaction()

      try {
        // 1. Validaciones iniciales
        const storeExists = await StoreServicesPublic.findById.execute(idStore)
        if (!storeExists) {
          await t.rollback()
          return { success: false, message: 'Store not found', errors: [] }
        }

        if (!Array.isArray(args.input) || args.input.length === 0) {
          await t.rollback()
          return { success: false, message: 'No products to add', data: null, errors: [] }
        }

        // 2. Instanciar servicios una sola vez
        const ShoppingServices = ShoppingServicesTenantFactory(idStore)
        const StatusOrderServices = StatusOrderServicesTenantFactory(idStore)
        const ProductExtraServices = ProductExtraServicesTenantFactory(idStore)
        const ProductOptionalServices = ProductOptionalServicesTenantFactory(idStore)


        for (const item of args.input) {
          const newItem = {
            ProPrice: 0,
            id: context?.User?.id ?? null,
            ...item
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
              }))
            }
          }
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
          const extras = item.dataExtra || []
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

          await ProductOptionalServices.bulkCreateProductOptionalAndSubOptional.execute(dataOptional.map(op => ({
            ...op,
            pCodeRef: args.pCodeRef,
            idStore,
            pId: soldPid
          })), t)
        }
        // Resto del flujo (sumPrice, statusOrder, etc.)
        const response = await ShoppingTypesServices.sumPrice.execute(args.shoppingCartRefCode)
        const {
          id,
          tableId,
          change,
          discount,
          valueDelivery,
          payMethodPState,
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
          payMethodPState,
          pickUp: PickUpMethod.inStorePickup,
          channel: Channel.store,
          createdAt: new Date(),
          updatedAt: new Date()
        }

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
            }))
          }
        }
        const createResponse = await StatusOrderServices.create.execute(value, t)
        if (createResponse?.success === false) {
          const end = Date.now()
          const durationMs = end - start
          const time = (durationMs / 1000).toFixed(2)
          console.log('🚀 ~ time:', time)
          await t.rollback()
          return {
            success: false,
            message: createResponse.message,
            data: createResponse.data ?? null,
            errors: []
          }
        }

        await t.commit()
        const end = Date.now()
        const durationMs = end - start
        const time = (durationMs / 1000).toFixed(2)
        console.log('🚀 ~ time:', time)
        const newOrder = {
          id: createResponse?.data?.id ?? '',
          idStore: idStore,
          pCodeRef: createResponse?.data?.pCodeRef ?? ''
        }
        if (context.pubsub) {
          context.pubsub.publish(NEW_STORE_ORDER, { newStoreOrder: { ...newOrder } });
        }
        return createResponse

      } catch (e) {
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
      pubsub.publish(NEW_STORE_ORDER, { newStoreOrder: { ...newOrder } });
      return newOrder
    }
  }
}

