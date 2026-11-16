import type { WeeklyWindow, WeeklyStockSnapshot } from '../services/weekly-stock-comparison'

/** A single logical read of the eight calendar windows and observation start. */
export interface WeeklyStockReadPort {
  readWeeklySnapshot(windows: WeeklyWindow[], asOf: string): Promise<WeeklyStockSnapshot>
}
