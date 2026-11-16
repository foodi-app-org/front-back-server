import { buildWeeklyWindows, compareWeeklyStock } from '../../domain/services/weekly-stock-comparison'
import type { WeeklyStockReportRow } from '../../domain/services/weekly-stock-comparison'
import type { WeeklyStockReadPort } from '../../domain/repositories/weekly-stock-read.repository'

/** Application orchestration. The same clock value governs every SQL bound. */
export class GetWeeklyStockMovementUseCase {
  constructor (
    private readonly repository: WeeklyStockReadPort,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async execute(): Promise<WeeklyStockReportRow[]> {
    const now = this.clock()
    const windows = buildWeeklyWindows(now)
    const snapshot = await this.repository.readWeeklySnapshot(windows, now.toISOString())
    return compareWeeklyStock(windows, snapshot)
  }
}
