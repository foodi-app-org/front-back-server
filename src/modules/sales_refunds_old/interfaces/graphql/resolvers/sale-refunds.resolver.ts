import { GraphQLError } from 'graphql'
import type { GraphQLContext } from '@shared/types/context'
import { authorizedCash } from '@modules/cash_management/infrastructure/validators/cash-access'
import { CashError } from '@modules/cash_management/domain/services/cash-money'
import { RefundError } from '../../../domain/refund-math'
import type { RequestSaleRefundInput, ConfirmExternalSaleRefundInput,
  CancelSaleRefundInput } from '../../../domain/refund.entity'
import { SaleRefundServicesTenantFactory } from '../../../main/factories/sale-refunds.factory'

function asGraphql<T>(fn: () => Promise<T>): Promise<T> {
  return fn().catch(error => {
    if (error instanceof RefundError || error instanceof CashError) {
      throw new GraphQLError(error.message, { extensions: { code: error.code } })
    }
    throw error
  })
}
/** Tenant and actor ALWAYS come from JWT context, not from mutation arguments. */
export const saleRefundResolvers = {
  Query: {
    getSaleRefundPreview: (_: unknown, args: { saleReference: string }, context: GraphQLContext) =>
      asGraphql(() => SaleRefundServicesTenantFactory(authorizedCash(context, 'read')).refunds.preview(args.saleReference)),
    getSaleRefunds: (_: unknown, args: { saleReference: string }, context: GraphQLContext) =>
      asGraphql(() => SaleRefundServicesTenantFactory(authorizedCash(context, 'read')).refunds.list(args.saleReference))
  },
  Mutation: {
    requestSaleRefund: (_: unknown, args: { input: RequestSaleRefundInput }, context: GraphQLContext) =>
      asGraphql(() => SaleRefundServicesTenantFactory(authorizedCash(context, 'move')).refunds.request(args.input)),
    confirmExternalSaleRefund: (_: unknown, args: { input: ConfirmExternalSaleRefundInput }, context: GraphQLContext) =>
      asGraphql(() => SaleRefundServicesTenantFactory(authorizedCash(context, 'approve')).refunds.confirmExternal(args.input)),
    cancelSaleRefund: (_: unknown, args: { input: CancelSaleRefundInput }, context: GraphQLContext) =>
      asGraphql(() => SaleRefundServicesTenantFactory(authorizedCash(context, 'move')).refunds.cancel(args.input))
  }
}
