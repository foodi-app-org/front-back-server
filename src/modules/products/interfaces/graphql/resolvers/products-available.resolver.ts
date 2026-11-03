import { ContextValidator } from '@shared/utils/context-validator'

import type { GraphQLContext } from '../../../../../shared/types/context'

import { availableProductSchema } from '../../../infrastructure/validators'
import { ProductServicesTenantFactory } from '../../../main/factories/products-services.factory'

export type AvailableProduct = {
  idStore: string
  pId: string
  dayAvailable: number
  startDate: string
  endDate: string
  state: number
}

type RegisterAvailableProductArgs = {
  input: AvailableProduct[]
}

const DEFAULT_START_DATE = '00:00'
const DEFAULT_END_DATE = '23:59'
const DEFAULT_STATE = 1

const normalizeAvailableProducts = (
  input: AvailableProduct[],
  idStore: string
): AvailableProduct[] => {
  return input.map(item => ({
    ...item,
    idStore,
    startDate: item.startDate ?? DEFAULT_START_DATE,
    endDate: item.endDate ?? DEFAULT_END_DATE,
    state: DEFAULT_STATE
  }))
}

const validateAvailableProducts = (input: AvailableProduct[]) => {
  return input.flatMap(available => {
    const { error } = availableProductSchema.validate(available, {
      abortEarly: false
    })

    return error?.details.map(({ message, path, type, context }) => ({
      message,
      path,
      type,
      context
    })) ?? []
  })
}

export const productAvailableResolvers = {
  Query: {},

  Mutation: {
    registerAvailableProduct: async (
      _parent: unknown,
      { input }: RegisterAvailableProductArgs,
      context: GraphQLContext
    ) => {
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()

      if (!idStore) {
        return {
          success: false,
          data: null,
          message: 'Store ID is required',
          errors: [
            {
              message: 'Store ID is required',
              path: ['idStore']
            }
          ]
        }
      }

      const mappedInput = normalizeAvailableProducts(input, idStore)

      const validationErrors = validateAvailableProducts(mappedInput)

      if (validationErrors.length > 0) {
        return {
          success: false,
          data: null,
          message: 'Error de validación',
          errors: validationErrors
        }
      }

      const services = ProductServicesTenantFactory(idStore)

      return services.registerAvailableProduct.execute(mappedInput)
    }
  }
}