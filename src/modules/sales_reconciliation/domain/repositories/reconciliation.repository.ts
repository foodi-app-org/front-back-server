import type { SaleSnapshot, dateRange } from '../../application/reconciliation'
export interface ReconciliationRepository {
  load(range: ReturnType<typeof dateRange>, channel: number): Promise<SaleSnapshot[]>
}
