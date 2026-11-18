import type { CancellationCashProof, CancellationSettlementVerification, SaleCancellationSnapshot } from '../cancellation.types'

export interface CancellationReadRepository {
  readonly storeId: string
  inspectSale(saleReference: string): Promise<SaleCancellationSnapshot>
  getCashProofs(saleId: string): Promise<CancellationCashProof[]>
  getSettlementAudits(saleId: string): Promise<CancellationSettlementVerification[]>
}
