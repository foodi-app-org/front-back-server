import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { productSubOptionalExtraSchema, UpdateproductSubOptionalExtraSchema } from '../../../infrastructure/validators/product-sub-optional-extra.validator'
import { ProductSubOptionalServicesTenantFactory } from '../../../main/factories/product-optional-extra-services.factory'
import { ContextValidator } from '@shared/utils/context-validator'

type UpdateProductSubOptionalInput = {
  opSubExPid: string
  OptionalSubProName?: string
  isCustomSubOpExPid?: boolean
  exCodeOptionExtra?: string
}

type CreateProductSubOptionalInput = {
  exCode: string
  exCodeOptionExtra: string
  OptionalSubProName: string
  pId: string
  idStore: string
  state: number
}

const executeUpdateProductSubOptional = async (
  input: UpdateProductSubOptionalInput,
  context: GraphQLContext
) => {
  const validator = new ContextValidator(context)
  const idStore = validator.validateUserSession()

  const { error, value } = UpdateproductSubOptionalExtraSchema.validate({
    ...input,
    idStore: idStore ?? ''
  })

  if (error) {
    return {
      success: false,
      data: null,
      message: 'Error de validación'

    }
  }

  const services = ProductSubOptionalServicesTenantFactory(idStore ?? '')

  return services.update.execute(value, idStore ?? '')
}


export const productSubOptionalExtraResolvers = {
  Query: {},

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

    editExtFoodSubsOptional: async (
      _: GraphQLResolveInfo,
      args: UpdateProductSubOptionalInput,
      context: GraphQLContext
    ) => {
      return executeUpdateProductSubOptional(args, context)
    },

    DeleteExtFoodSubsOptional: async (
      _: GraphQLResolveInfo,
      args: { opSubExPid: string; state: number; isCustomSubOpExPid?: boolean },
      context: GraphQLContext
    ) => {
      const services = ProductSubOptionalServicesTenantFactory(
        context.restaurant ?? ''
      )

      const { opSubExPid, state, isCustomSubOpExPid } = args

      return services.delete.execute({
        code: opSubExPid,
        state,
        isCustomSubOpExPid: isCustomSubOpExPid ?? false
      })
    }
  }
}
