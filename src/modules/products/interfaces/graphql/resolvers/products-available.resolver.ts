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

type UpdateAvailableProductArgs = {
  pId?: string
  input: AvailableProduct[]
}

type GetAllAvailableProductArgs = {
  pId?: string
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
  Query: {
    getAllAvailableProduct: async (
      _parent: unknown,
      { pId }: GetAllAvailableProductArgs,
      context: GraphQLContext
    ) => {
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()

      // Without a product id there is nothing to read. Return an empty list
      // so clients can safely interpret it as "available all week".
      if (!pId) {
        return []
      }

      const services = ProductServicesTenantFactory(idStore ?? '')

      const result = await services.getAvailableProducts.execute(pId, idStore ?? undefined)

      // The GraphQL field resolves to [AvailableProduct]; surface only the data.
      return result.data
    }
  },

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
    },

    /**
     * Updates (synchronizes) the whole weekly availability of a product.
     * Accepts the full desired set of days/ranges; the backend reconciles it
     * (create new, update existing, remove the rest). An empty input clears
     * the schedule. The product id is taken from `pId` or from the input.
     */
    updateAvailableProduct: async (
      _parent: unknown,
      { pId, input }: UpdateAvailableProductArgs,
      context: GraphQLContext
    ) => {
      const validator = new ContextValidator(context)
      const idStore = validator.validateUserSession()

      if (!idStore) {
        return {
          success: false,
          data: null,
          message: 'Store ID is required',
          errors: [{ message: 'Store ID is required', path: ['idStore'] }]
        }
      }

      const items = Array.isArray(input) ? input : []

      // Resolve the product id from the explicit arg or the first item.
      const productId = pId ?? items.find(item => item?.pId)?.pId

      if (!productId) {
        return {
          success: false,
          data: null,
          message: 'pId is required to update availability',
          errors: [{ message: 'Missing pId', path: ['pId'] }]
        }
      }

      const mappedInput = normalizeAvailableProducts(items, idStore)

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

      return services.updateAvailableProduct.execute(productId, idStore, mappedInput)
    }
  }
}