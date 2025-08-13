import { GraphQLResolveInfo } from 'graphql'

import { Channel } from '../../../../../shared/constants/channel'
import { PickUpMethod } from '../../../../../shared/constants/typePickUp'
import connect from '../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { GraphQLContext } from '../../../../../shared/types/context'
import { ShoppingTypesServices } from '../../../../shopping/infrastructure/services'
import { StoreServices } from '../../../../store/infrastructure/services'
import { StatusOrderTypesServices } from '../../../infrastructure/services'
import { shoppingCartItemSchema, statusOrderSchema } from '../../../infrastructure/validators'
import { RegisterSalesStoreInput, StateShoppingCart } from '../inputs'

export const orderResolvers = {
  Query: {

  },
  Mutation: {
    registerSalesStore: async (_: GraphQLResolveInfo, args: RegisterSalesStoreInput, context: GraphQLContext) => {
      const idStore = context.restaurant ?? args.idStore
      const sequelize = connect()
      const t = await sequelize.transaction()

      try {
        const storeExists = await StoreServices.findById.execute(idStore)
        if (!storeExists) {
          await t.rollback()
          return {
            success: false,
            message: 'Store not found',
            errors: []
          }
        }

        for (const item of args.input) {
          const { error } = shoppingCartItemSchema.validate(item, { abortEarly: false })
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

          const generatedCode = (Math.random() + 1).toString(36).substring(2, 15)
          const response = await ShoppingTypesServices.create.execute({
            idStore,
            pId: item.pId,
            shoppingCartRefCode: args.shoppingCartRefCode,
            priceProduct: item.priceProduct,
            cantProducts: item.cantProducts,
            idUser: item.idUser,
            comments: item.comments,
            id: args.id,
            refCodePid: generatedCode,
            sState: StateShoppingCart.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
          }) // PASAMOS transacción
          if (response?.success === false) {
            await t.rollback()
            return {
              success: false,
              message: response.message,
              data: null,
              errors: []
            }
          }
        }

        const response = await ShoppingTypesServices.sumPrice.execute(args.shoppingCartRefCode) // PASAMOS transacción

        const {
          id,
          tableId,
          change,
          discount,
          valueDelivery,
          payMethodPState,
          shoppingCartRefCode,
          pCodeRef,
          tip = 0,
        } = args

        const mockSalesStore = {
          id,
          tableId,
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

        const createResponse = await StatusOrderTypesServices.create.execute(value) // PASAMOS transacción

        if (createResponse?.success === false) {
          await t.rollback()
          return {
            success: false,
            message: createResponse.message,
            data: null,
            errors: []
          }
        }

        await t.commit()

        return createResponse

      } catch (e) {
        await t.rollback()
        return {
          success: false,
          message: e instanceof Error ? e.message : String(e),
          errors: []
        }
      }
    }
  }
}
