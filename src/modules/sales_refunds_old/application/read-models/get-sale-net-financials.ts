import { projectNetSaleFinancials, RefundFinancialRow } from '@modules/sales_refunds/domain/sale-net-financials';
import type { CashRepository, TransactionPort } from '../../../cash_management/domain/repositories/cash.repository'
import { decimalMinor } from '../../../cash_management/domain/services/cash-money'

type SaleHeader = { stPId: string; netTotal: string | number | null }

/** Read-only projection. Does not mutate orders_statuses, payments or cash_movements. */
export class GetSaleNetFinancials {
  constructor(private readonly repository: CashRepository) {}

  async execute(saleReference: string) {
    if (!saleReference || saleReference.length > 100) throw new Error('REFUND_SALE_REFERENCE_INVALID')
    const read = async (tx: TransactionPort) => {
      const sale = (await tx.query<SaleHeader>(`SELECT "stPId", "netTotal"
        FROM ${tx.table('orders_statuses')}
        WHERE "idStore"=:store AND "pCodeRef"=:reference LIMIT 1`,
        { store: this.repository.idStore, reference: saleReference }))[0]
      if (!sale) throw new Error('REFUND_SALE_NOT_FOUND')
      if (sale.netTotal === null || sale.netTotal === undefined) throw new Error('REFUND_LEGACY_SALE')
      const refunds = await tx.query<RefundFinancialRow>(`SELECT "id", "saleId", "status", "amountMinor", "confirmedAt"
        FROM ${tx.table('sale_refunds')}
        WHERE "idStore"=:store AND "saleId"=:saleId ORDER BY "id"`,
        { store: this.repository.idStore, saleId: sale.stPId })
      // orders_statuses.netTotal is a decimal COP value; refund.amountMinor uses integer centésimas.
      return projectNetSaleFinancials(sale.stPId, decimalMinor(String(sale.netTotal)).toString(), refunds)
    }
    // Reuse cash repo read-only consistent transaction when available.
    return this.repository.read ? this.repository.read(read) : this.repository.transaction(read)
  }
}
