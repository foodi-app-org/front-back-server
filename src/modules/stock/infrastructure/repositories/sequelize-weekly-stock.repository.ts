import { QueryTypes, type Sequelize } from 'sequelize'
import { toStoredUtcFormat } from '@shared/utils/period-range.utils'
import type { WeeklyStockReadPort } from '../../domain/repositories/weekly-stock-read.repository'
import type { WeeklyWindow, WeeklyStockSnapshot } from '../../domain/services/weekly-stock-comparison'
import { weeklyStockSql } from './weekly-stock-sql'

/** Read-only adapter. Date bounds use the exact existing DB UTC storage format. */
export class SequelizeWeeklyStockRepository implements WeeklyStockReadPort {
  constructor (
    private readonly sequelize: Sequelize,
    private readonly tenant: string
  ) {}

  async readWeeklySnapshot(windows: WeeklyWindow[], asOf: string): Promise<WeeklyStockSnapshot> {
    if (windows.length !== 8) throw new Error('Expected eight weekly windows')

    const replacements: Record<string, string> = {
      asOf: toStoredUtcFormat(asOf),
      decrementType: 'DECREMENT'
    }

    windows.forEach((window, index) => {
      replacements[`start${index}`] = toStoredUtcFormat(window.startAt)
      replacements[`end${index}`] = toStoredUtcFormat(window.endAt)
    })

    const [row] = await this.sequelize.query<Record<string, unknown>>(
      weeklyStockSql(this.tenant, this.sequelize.getDialect()),
      { type: QueryTypes.SELECT, replacements }
    )
    if (!row) throw new Error('Missing weekly stock snapshot')

    const firstAt = row.firstAt
    if (firstAt !== null && typeof firstAt !== 'string' && !(firstAt instanceof Date)) {
      throw new Error('Invalid first stock timestamp')
    }

    const totals = windows.map((_, index) => {
      const value = row[`w${index}`]
      // PostgreSQL returns BIGINT/NUMERIC sums as strings.
      if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value))) {
        throw new Error('Invalid weekly sum')
      }
      return Number(value)
    })

    return { firstAt, totals }
  }
}
