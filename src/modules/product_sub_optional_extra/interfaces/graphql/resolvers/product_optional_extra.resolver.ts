import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { productSubOptionalExtraSchema } from '../../../infrastructure/validators/product-sub-optional-extra.validator'
import { ProductSubOptionalServicesTenantFactory } from '../../../main/factories/product-optional-extra-services.factory'

type CreateProductSubOptionalInput = {
  exCode: string
  exCodeOptionExtra: string
  OptionalSubProName: string
  pId: string
  idStore: string
  state: number
}

export const productSubOptionalExtraResolvers = {
  Query: {

  },
  Mutation: {
    updateExtProductSubOptional: async (_: GraphQLResolveInfo, args: { input: CreateProductSubOptionalInput }, context: GraphQLContext) => {
      const values = { ...args.input }
      const { error, value } = productSubOptionalExtraSchema.validate({
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
      const services = ProductSubOptionalServicesTenantFactory(context.restaurant ?? '')
      return await services.create.execute(value, context.restaurant ?? '')
    },
    DeleteExtFoodSubsOptional: async (_: GraphQLResolveInfo, args: { opSubExPid: string, state: number }, context: GraphQLContext) => {
      const services = ProductSubOptionalServicesTenantFactory(context.restaurant ?? '')
      const { opSubExPid, state } = args ?? {
        opSubExPid: '',
        state: null
      }
      return await services.delete.execute({ code: opSubExPid, state })
    }
  }
}
