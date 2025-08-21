import { Op } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { DateRange } from '../../../../shared/utils/date-range.utils'
import { SalesRepository } from '../../domain/repositories/sales.repository'

export class SequelizeSalesRepository implements SalesRepository {
  private readonly dateRange: DateRange
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.dateRange = new DateRange()
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async countSales(start: Date, end: Date): Promise<number> {
    // use dateRange to get start/end of day
    const { start: startOfDay, end: endOfDay } = this.dateRange.getRange({ start, end })
    
    try {
      const result = await models.StatusOrder.schema(this.tenant).count({
        where: {
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay
          }
        }
      })
      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}