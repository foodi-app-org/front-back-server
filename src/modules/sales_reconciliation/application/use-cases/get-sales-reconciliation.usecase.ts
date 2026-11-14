import type { ReconciliationRepository } from '../../domain/repositories/reconciliation.repository'
import { dateRange, makeReport } from '../reconciliation'
export class GetSalesReconciliationUseCase {
  constructor(private readonly repository: ReconciliationRepository) {}
  async execute(from: string, to: string, channel = 1) {
    if (channel !== 1) throw new Error('INVALID_CHANNEL')
    const range = dateRange(from, to)
    return makeReport(await this.repository.load(range, channel), range, channel)
  }
}
