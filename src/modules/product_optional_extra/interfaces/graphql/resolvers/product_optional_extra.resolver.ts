import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { productOptionalExtraSchema } from '../../../infrastructure/validators/product-optional-extra.validator'
import { ProductOptionalServicesTenantFactory } from '../../../main/factories/product-optional-extra-services.factory'

type CreateStatusTypeOrderInput = {
  pId: string
  OptionalProName: string
  numbersOptionalOnly?: number
  code: string
  required?: number
  state?: number
  opExPid?: string
}

export const productOptionalExtraResolvers = {
  Query: {
    ExtProductFoodsOptionalAll: async (_: GraphQLResolveInfo, { pId }: { pId: string }, context: GraphQLContext) => {
      console.log('🚀 ~ pId:', pId)
      try {
        const store = context.restaurant ?? ''
        const services = ProductOptionalServicesTenantFactory(store)
        const result = await services.getAllProductOptionalByProductId.execute(pId)
        const { data } = result ?? {
          data: null
        }
        return data.map(item => ({
          ...item.dataValues,
          ExtProductFoodsSubOptionalAll: item.ExtProductFoodsSubOptionalAll ? item.ExtProductFoodsSubOptionalAll.map(subItem => subItem.dataValues) : []
        }))
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Unexpected error',
          data: null
        }
      }
    }
  },
  Mutation: {
    updateExtProductOptional: async (_: GraphQLResolveInfo, args: { input: CreateStatusTypeOrderInput }, context: GraphQLContext) => {
      const values = { ...args.input }
      const { error, value } = productOptionalExtraSchema.validate({
        ...values,
        idStore: context.restaurant ?? ''
      })
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
      const services = ProductOptionalServicesTenantFactory(context.restaurant ?? '')
      return await services.create.execute(value, context.restaurant ?? '')
    },

    DeleteExtProductFoodsOptional: async (_: GraphQLResolveInfo, args: { opExPid: string, state: number }, context: GraphQLContext) => {
      const services = ProductOptionalServicesTenantFactory(context.restaurant ?? '')
      const { opExPid, state } = args ?? {
        opExPid: '',
        state: null
      }
      return await services.delete.execute({ code: opExPid, state })
    }
  }
}
