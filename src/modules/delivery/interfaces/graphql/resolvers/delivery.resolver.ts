import { GraphQLError } from 'graphql'
import type { GraphQLContext } from '../../../../../shared/types/context'
import { ContextValidator } from '../../../../../shared/utils/context-validator'
import { DeliveryServicesTenantFactory } from '../../../main/factories/delivery-services.factory'
import { DeliveryError } from '../../../domain/services/delivery-error'
import { displayMinor } from '../../../domain/services/delivery-money'
import { policyFor } from '../../../domain/services/delivery-policy'
import type { DeliveryMethod } from '../../../domain/entities/delivery-method.entity'
import type { DeliveryQuoteInput, DeliveryTerms } from '../../../domain/entities/sale-delivery.entity'
import { validateActor, validateCreate, validateId, validateQuote, validateReference, validateRevision, validateStatus, validateUpdate } from '../../../infrastructure/validators/delivery.validator'

export interface DeliveryAuthorization {
  canManage(context: GraphQLContext): boolean | Promise<boolean>
  canTrack(context: GraphQLContext): boolean | Promise<boolean>
}
const deny: DeliveryAuthorization = { canManage: () => false, canTrack: () => false }
function session(context: GraphQLContext) {
  const idStore = new ContextValidator(context).validateUserSession()
  if (!idStore || !context.User?.id) throw new GraphQLError('Sesión no autorizada', { extensions: { code: 'FORBIDDEN' } })
  return { actor: validateActor(context.User.id), services: DeliveryServicesTenantFactory(idStore) }
}
async function authorized(allow: boolean | Promise<boolean>) {
  if (await allow !== true) throw new GraphQLError('Permiso de domicilio requerido', { extensions: { code: 'FORBIDDEN' } })
}
async function handle<T>(fn: () => Promise<T>): Promise<T> {
  try { return await fn() } catch (error) {
    if (error instanceof GraphQLError) throw error
    if (error instanceof DeliveryError) throw new GraphQLError(error.message, { extensions: { code: error.code } })
    // Never disclose SQL or a tenant identifier to GraphQL clients.
    console.error('Delivery operation failed', error)
    throw new GraphQLError('No fue posible completar la operación de domicilio', { extensions: { code: 'INTERNAL_SERVER_ERROR' } })
  }
}
const viewMethod = (m: DeliveryMethod) => ({ ...m, ...policyFor(m.mode), defaultFee: m.defaultFeeMinor === null ? null : displayMinor(m.defaultFeeMinor) })
const viewTerms = <T extends DeliveryTerms>(terms: T) => ({ ...terms, customerFee: displayMinor(terms.customerFeeMinor), providerCost: terms.providerCostMinor == null ? null : displayMinor(terms.providerCostMinor), posCharge: displayMinor(terms.posChargeMinor), externalCharge: displayMinor(terms.externalChargeMinor), merchantRevenue: displayMinor(terms.merchantRevenueMinor), thirdPartyPayable: displayMinor(terms.thirdPartyPayableMinor), merchantCost: terms.merchantCostMinor == null ? null : displayMinor(terms.merchantCostMinor) })
export function createDeliveryResolvers(auth: DeliveryAuthorization = deny) {
  return {
    Type: {},
    Query: {
      getDeliveryMethods: (_: unknown, args: { includeInactive?: boolean }, context: GraphQLContext) => handle(async () => {
        const { services } = session(context)
        if (args.includeInactive) await authorized(auth.canManage(context))
        return (await services.listMethods.execute(args.includeInactive === true)).map(viewMethod)
      }),
      quoteSaleDelivery: (_: unknown, args: { input: DeliveryQuoteInput }, context: GraphQLContext) => handle(async () => {
        const { services } = session(context)
        return viewTerms(await services.quote.execute(validateQuote(args.input)))
      }),
      getSaleDelivery: (_: unknown, args: { saleReference: string }, context: GraphQLContext) => handle(async () => {
        const { services } = session(context)
        const snapshot = await services.getSaleDelivery.execute(validateReference(args.saleReference))
        return snapshot ? viewTerms(snapshot) : null
      })
    },
    Mutation: {
      createDeliveryMethod: (_: unknown, args: { input: Record<string, unknown> }, context: GraphQLContext) => handle(async () => {
        const { actor, services } = session(context)
        await authorized(auth.canManage(context))
        return viewMethod(await services.createMethod.execute(validateCreate(args.input),actor))
      }),
      updateDeliveryMethod: (_: unknown, args: { id: string; expectedRevision: number; input: Record<string, unknown> }, context: GraphQLContext) => handle(async () => {
        const { actor, services } = session(context)
        await authorized(auth.canManage(context))
        return viewMethod(await services.updateMethod.execute(validateId(args.id),validateRevision(args.expectedRevision),validateUpdate(args.input),actor))
      }),
      updateSaleDeliveryStatus: (_: unknown, args: { saleReference: string; expected: unknown; next: unknown }, context: GraphQLContext) => handle(async () => {
        const { actor, services } = session(context)
        await authorized(auth.canTrack(context))
        return viewTerms(await services.updateStatus.execute(validateReference(args.saleReference),validateStatus(args.expected),validateStatus(args.next),actor))
      })
    }
  }
}
// Fail closed until wired to the application's existing server-side RBAC.
export const deliveryResolvers = createDeliveryResolvers()
