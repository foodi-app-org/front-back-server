import { GraphQLError } from 'graphql'
import type { GraphQLContext } from '@shared/types/context'
import { authorizedCash } from '@modules/cash_management/infrastructure/validators/cash-access'
import { SequelizeCashRepository } from '@modules/cash_management/infrastructure/repositories/sequelize-cash.repository'
import { auditRefundKardexQuantitative } from '../../../infrastructure/repositories/refund-kardex-reconciliation'
import { GetRefundAccounting } from '../../../application/read-models/get-refund-accounting'
import { getRefundSettlementLedger } from '../../../infrastructure/repositories/refund-settlement-ledger.repository'
import { dateRange } from '@modules/sales_reconciliation/application/reconciliation'
import connect from '@shared/infrastructure/db/sequelize/sequelize.connect'
import { getTenantName } from '@shared/utils/tenant.utils'
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
    getSaleRefundAccounting: (_: unknown, args: { saleReference: string }, context: GraphQLContext) =>
      asGraphql(() => {
        const actor = authorizedCash(context, 'audit')
        return new GetRefundAccounting(new SequelizeCashRepository(actor.storeId)).execute(args.saleReference)
      }),
    getRefundSettlementLedger: (_: unknown, args: { from: string; to: string }, context: GraphQLContext) =>
      asGraphql(() => {
        const actor = authorizedCash(context, 'audit')
        const range = dateRange(args.from, args.to)
        return getRefundSettlementLedger(connect(), getTenantName(actor.storeId), actor.storeId,
          range.start, range.endExclusive).then(result => ({...result, from:args.from, to:args.to,
            timezone:'America/Bogota', currency:'COP'}))
      }),
    getSaleRefundKardexAudit: (_: unknown, args: { refundId: string }, context: GraphQLContext) =>
      asGraphql(() => {
        const actor = authorizedCash(context, 'audit')
        const repo = new SequelizeCashRepository(actor.storeId)
        const work = (tx: import('@modules/cash_management/domain/repositories/cash.repository').TransactionPort) =>
          auditRefundKardexQuantitative(tx, args.refundId, actor.storeId)
        return repo.read ? repo.read(work) : repo.transaction(work)
      }),
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
