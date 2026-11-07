import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { ExtraStockServicesTenantFactory } from '../../../infrastructure/inventory/extra-stock.factory'
import { productExtraSchema } from '../../../infrastructure/validators/product-extra.validator'
import { ProductExtraServicesTenantFactory } from '../../../main/factories/product-extra-services.factory'
import { ContextValidator } from '@shared/utils/context-validator'

type CreateStatusTypeOrderInput = {
  extraPrice: number,
  exState: number,
  extraName: string,
  pId: string,
  manageStock?: boolean,
  stock?: number
}

export const productExtraResolvers = {
  Query: {
    ExtProductFoodsAll: async (_: GraphQLResolveInfo, args: { pId: string }, context: GraphQLContext) => {
      const { pId } = args ?? {
        pId: ''
      }
      try {
        const services = ProductExtraServicesTenantFactory(context.restaurant ?? '')
        const result = await services.getAllByProductId.execute(pId)
        const { data } = result ?? {
          data: null
        }
        return data
      } catch (err) {
        console.error(err)
        return null
      }
    },
    /**
     * Lista TODOS los complementos (extras) de la tienda que se manejan por
     * inventario y tienen existencias (`manageStock = true`, `stock > 0`).
     * A diferencia de `ExtProductFoodsAll` (que requiere `pId`), esta query no
     * necesita un producto: devuelve el catálogo completo de complementos con
     * stock para la vista "Unidades en inventario".
     */
    ExtProductFoodsInStock: async (_: GraphQLResolveInfo, _args: Record<string, never>, context: GraphQLContext) => {
      try {
        const services = ProductExtraServicesTenantFactory(context.restaurant ?? '')
        const result = await services.getAllInStock.execute()
        return result?.data ?? []
      } catch (err) {
        console.error(err)
        return []
      }
    }
  },
  Mutation: {
    updateMultipleExtProduct: async (
      _: GraphQLResolveInfo,
      args: { inputLineItems: { setData: CreateStatusTypeOrderInput[] } },
      context: GraphQLContext
    ) => {
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()
      const values = args.inputLineItems.setData.map(item => ({
        ...item,
        idStore: idStore ?? ''
      }))
      for (const val of values) {
        const { error } = productExtraSchema.validate(
          val,
          { abortEarly: false }
        )
        if (error) {
          return {
            success: false,
            data: null,
            message: 'Error de validación',
            errors: error?.details.map(e => ({
              message: e.message,
              path: e.path,
              type: e.type,
              context: e.context
            }))
          }
        }
      }

      const services = ProductExtraServicesTenantFactory(context.restaurant ?? '')
      const result = await services.create.execute(values, context.restaurant ?? '')
      if (result.success) {
        // Inventario: registra el movimiento inicial (IN) en el kardex
        // (stock_history) por cada complemento creado que maneje stock,
        // tratándolo como un producto real.
        const createdExtras = Array.isArray(result.data) ? result.data : []
        const extraStock = ExtraStockServicesTenantFactory(context.restaurant ?? '', context.pubsub)
        await Promise.all(
          createdExtras.map((extra: any) => {
            const stockValue = Number(extra?.stock) || 0
            if (!extra?.manageStock || stockValue <= 0 || !extra?.exPid) return null
            return extraStock.registerInitialStock(extra.exPid, stockValue)
          })
        )
        return {
          success: result.success,
          message: result.message,
          data: createdExtras
        }
      }
      return {
        success: result.success,
        message: result.message,
        errors: result.errors ?? [],
        data: []
      }
    },
    deleteExtraProduct: async (
      _: GraphQLResolveInfo,
      args: { id: string, state: number },
      context: GraphQLContext
    ) => {
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()

      const { id, state } = args ?? {
        id: '',
        state: null
      }
      try {
        const services = ProductExtraServicesTenantFactory(idStore ?? '')
        return await services.delete.execute({ id, state })
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Unexpected error',
          data: null
        }
      }
    },
    editExtraProductFoods: async (
      _: GraphQLResolveInfo,
      args: { exPid: string; extraName: string; extraPrice: number; manageStock?: boolean; stock?: number },
      context: GraphQLContext
    ) => {
      const { exPid, extraName, extraPrice, manageStock, stock } = args
      try {
        const services = ProductExtraServicesTenantFactory(context.restaurant ?? '')
        // 1) Update catalog fields (name, price, manageStock flag). The stock
        //    column itself is applied via the inventory service below so the
        //    kardex stays consistent (single movement, no double counting).
        const result = await services.update.execute({ exPid, extraName, extraPrice, manageStock, stock }) as any
        if (!result?.success) {
          return result
        }

        // 2) Apply the stock change through the inventory service when the
        //    complement manages stock and a target stock was provided.
        //    Raising the stock of an existing complement is an INVENTORY ENTRY,
        //    so we register ONLY the positive difference as a RESTOCK (IN) move
        //    via `restock(delta)`. `restock` adds exactly `delta` to the stock
        //    and writes a single RESTOCK row to stock_history (meta.kind=EXTRA),
        //    so the physical stock and the kardex stay consistent with no
        //    duplicate movements. The edit UI already prevents lowering the
        //    stock; we additionally guard here and never decrement from edit
        //    (delta <= 0 produces no movement). Reservations, sales (DECREMENT)
        //    and releases are untouched. When manageStock is false we do NOT
        //    touch inventory (the extra is not stock-controlled).
        const change = result?.stockChange
        if (change?.manageStock && change?.targetStock !== undefined) {
          const target = Number(change.targetStock)
          const previous = Number(change.previousStock ?? 0)
          const delta = target - previous
          if (Number.isFinite(delta) && delta > 0) {
            const extraStock = ExtraStockServicesTenantFactory(context.restaurant ?? '', context.pubsub)
            await extraStock.restock(exPid, delta)
          }
        }

        return result
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Unexpected error',
          data: null
        }
      }
    }
  }
}
