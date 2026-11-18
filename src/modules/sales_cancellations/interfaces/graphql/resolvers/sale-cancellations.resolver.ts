import { GraphQLError } from 'graphql'
import type { GraphQLContext } from '@shared/types/context'
import { authorizedCash } from '@modules/cash_management/infrastructure/validators/cash-access'
import { CancellationError } from '../../../domain/cancellation.policy'
import type { CancelUnpaidOrderInput, CancellationManualReviewInput } from '../../../application/use-cases/manage-sale-cancellation.usecase'
import type {
  CancelSaleInput, CompleteExternalCancellationInput, WithdrawSaleCancellationInput
} from '../../../domain/cancellation.types'
import { SaleCancellationsFactory } from '../../../main/factories/sale-cancellations.factory'
import { getCancellationSettlementLedger } from '../../../application/read-models/get-cancellation-settlement-ledger'
import { dateRange } from '@modules/sales_reconciliation/application/reconciliation'

const wrap = async <T>(run: () => Promise<T>): Promise<T> => {
  try { return await run() }
  catch (error) {
    if (error instanceof CancellationError) {
      throw new GraphQLError(error.message, { extensions: { code: error.code } })
    }
    // Existing RefundError and CashError retain their original application codes.
    throw error
  }
}

export const saleCancellationResolvers = {
  Type: {
    StoreOrders: {
      cancellationSummary: (parent: { pCodeRef?: string | null; idStore?: string | null }, _: unknown,
        context: GraphQLContext) => wrap(async () => {
          if (!parent?.pCodeRef) return null
          const actor = authorizedCash(context, 'audit')
          if (parent.idStore !== actor.storeId) {
            throw new GraphQLError('Venta de otro comercio', { extensions: { code: 'FORBIDDEN' } })
          }
          return SaleCancellationsFactory(actor).get(parent.pCodeRef)
        })
    }
  },
  Query: {
    getSaleCancellation: (_: unknown, args: { saleReference: string }, context: GraphQLContext) =>
      wrap(() => SaleCancellationsFactory(authorizedCash(context, 'audit')).get(args.saleReference)),
    getSaleCancellationLedger: (_: unknown, args: {from:string;to:string}, context: GraphQLContext) =>
      wrap(async () => {
        const actor = authorizedCash(context, 'audit')
        const range = dateRange(args.from, args.to)
        const result = await getCancellationSettlementLedger(actor.storeId, range.start, range.endExclusive)
        return { ...result, from:args.from, to:args.to, timezone:'America/Bogota', currency:'COP' }
      })
  },
  Mutation: {
    cancelUnpaidSaleOrder: (_: unknown, args: {input:CancelUnpaidOrderInput}, context:GraphQLContext) =>
      wrap(() => {
        const actor=authorizedCash(context,'move')
        authorizedCash(context,'approve')
        return SaleCancellationsFactory(actor).cancelUnpaidOrder(args.input)
      }),
    requestCancellationManualReview: (_:unknown,args:{input:CancellationManualReviewInput},context:GraphQLContext) =>
      wrap(() => SaleCancellationsFactory(authorizedCash(context,'move')).requestManualReview(args.input)),
    requestFullSaleCancellation: (_: unknown, args: { input: CancelSaleInput }, context: GraphQLContext) =>
      wrap(() => {
        const actor = authorizedCash(context, 'move')
        // A full financial cancellation is more sensitive than an ordinary partial return.
        // Both move and approve must be granted when cash RBAC is enabled.
        authorizedCash(context, 'approve')
        return SaleCancellationsFactory(actor).request(args.input)
      }),
    confirmExternalSaleCancellation: (_: unknown, args: { input: CompleteExternalCancellationInput }, context: GraphQLContext) =>
      wrap(() => SaleCancellationsFactory(authorizedCash(context, 'approve')).confirmExternal(args.input)),
    withdrawPendingSaleCancellation: (_: unknown, args: { input: WithdrawSaleCancellationInput }, context: GraphQLContext) =>
      wrap(() => SaleCancellationsFactory(authorizedCash(context, 'move')).withdraw(args.input))
  }
}
