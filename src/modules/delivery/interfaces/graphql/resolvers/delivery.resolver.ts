import { GraphQLError } from 'graphql'

import type { GraphQLContext } from '../../../../../shared/types/context'
import { ContextValidator } from '../../../../../shared/utils/context-validator'

import { DeliveryServicesTenantFactory } from '../../../main/factories/delivery-services.factory'

import { DeliveryError } from '../../../domain/services/delivery-error'
import { displayMinor } from '../../../domain/services/delivery-money'
import { policyFor } from '../../../domain/services/delivery-policy'

import type { DeliveryMethod } from '../../../domain/entities/delivery-method.entity'
import type {
  DeliveryQuoteInput,
  DeliveryTerms
} from '../../../domain/entities/sale-delivery.entity'

import {
  validateCreate,
  validateId,
  validateQuote,
  validateReference,
  validateRevision,
  validateStatus,
  validateUpdate
} from '../../../infrastructure/validators/delivery.validator'

/**
 * Resolves the current tenant without validating
 * administrative permissions or user roles.
 */
function session(context: GraphQLContext) {
  const idStore = new ContextValidator(context).validateUserSession()

  if (!idStore) {
    throw new GraphQLError('No hay un comercio activo', {
      extensions: {
        code: 'FORBIDDEN'
      }
    })
  }

  return {
    actor: context?.User?.id || 'UNIDENTIFIED',
    services: DeliveryServicesTenantFactory(idStore)
  }
}

/**
 * Centralized error handling.
 */
async function handle<T>(
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error
    }

    if (error instanceof DeliveryError) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.code
        }
      })
    }

    console.error('Delivery operation failed', error)

    throw new GraphQLError(
      'No fue posible completar la operación de domicilio',
      {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      }
    )
  }
}

/**
 * Maps persisted delivery methods to GraphQL.
 */
const viewMethod = (method: DeliveryMethod) => ({
  ...method,
  ...policyFor(method.mode),

  defaultFee:
    method.defaultFeeMinor === null
      ? null
      : displayMinor(method.defaultFeeMinor)
})

/**
 * Maps exact monetary amounts to decimal strings.
 */
const viewTerms = <T extends DeliveryTerms>(terms: T) => ({
  ...terms,

  customerFee: displayMinor(
    terms.customerFeeMinor
  ),

  providerCost:
    terms.providerCostMinor == null
      ? null
      : displayMinor(terms.providerCostMinor),

  posCharge: displayMinor(
    terms.posChargeMinor
  ),

  externalCharge: displayMinor(
    terms.externalChargeMinor
  ),

  merchantRevenue: displayMinor(
    terms.merchantRevenueMinor
  ),

  thirdPartyPayable: displayMinor(
    terms.thirdPartyPayableMinor
  ),

  merchantCost:
    terms.merchantCostMinor == null
      ? null
      : displayMinor(terms.merchantCostMinor)
})

export function createDeliveryResolvers() {
  return {
    Type: {},

    Query: {
      /**
       * Lists active or inactive delivery methods.
       */
      getDeliveryMethods: (
        _: unknown,
        args: {
          includeInactive?: boolean
        },
        context: GraphQLContext
      ) =>
        handle(async () => {
          const { services } = session(context)

          const methods = await services.listMethods.execute(
            args.includeInactive === true
          )

          return methods.map(viewMethod)
        }),

      /**
       * Calculates delivery financial distribution.
       */
      quoteSaleDelivery: (
        _: unknown,
        args: {
          input: DeliveryQuoteInput
        },
        context: GraphQLContext
      ) =>
        handle(async () => {
          const { services } = session(context)

          const quote = await services.quote.execute(
            validateQuote(args.input)
          )

          return viewTerms(quote)
        }),

      /**
       * Gets the historical delivery snapshot of a sale.
       */
      getSaleDelivery: (
        _: unknown,
        args: {
          saleReference: string
        },
        context: GraphQLContext
      ) =>
        handle(async () => {
          const { services } = session(context)

          const snapshot = await services.getSaleDelivery.execute(
            validateReference(args.saleReference)
          )

          return snapshot
            ? viewTerms(snapshot)
            : null
        })
    },

    Mutation: {
      /**
       * Creates a delivery method.
       */
      createDeliveryMethod: (
        _: unknown,
        args: {
          input: Record<string, unknown>
        },
        context: GraphQLContext
      ) =>
        handle(async () => {
          const { actor, services } = session(context)

          const method = await services.createMethod.execute(
            validateCreate(args.input),
            actor
          )

          return viewMethod(method)
        }),

      /**
       * Updates, activates or deactivates a delivery method.
       */
      updateDeliveryMethod: (
        _: unknown,
        args: {
          id: string
          expectedRevision: number
          input: Record<string, unknown>
        },
        context: GraphQLContext
      ) =>
        handle(async () => {
          const { actor, services } = session(context)

          const method = await services.updateMethod.execute(
            validateId(args.id),
            validateRevision(args.expectedRevision),
            validateUpdate(args.input),
            actor
          )

          return viewMethod(method)
        }),

      /**
       * Updates the operational delivery status.
       */
      updateSaleDeliveryStatus: (
        _: unknown,
        args: {
          saleReference: string
          expected: unknown
          next: unknown
        },
        context: GraphQLContext
      ) =>
        handle(async () => {
          const { actor, services } = session(context)

          const delivery = await services.updateStatus.execute(
            validateReference(args.saleReference),
            validateStatus(args.expected),
            validateStatus(args.next),
            actor
          )

          return viewTerms(delivery)
        })
    }
  }
}

export const deliveryResolvers = createDeliveryResolvers()