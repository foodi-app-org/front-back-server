
import { DateRange } from '@shared/utils/date-range.utils'
import { StatusOrder } from '../../domain/entities/status_order.entity'
import { StatusOrderRepository } from '../../domain/repositories/status_order.repository'

interface ResponseOrderStatusType {
  success: boolean
  message: string
  data: StatusOrder[] | null
}

export interface GetAllSalesStoreFilters {
  idStore?: string
  search?: string
  min?: number
  max?: number
  fromDate?: string
  toDate?: string
  channel?: number
}

export class GetAllByStatusTypeUseCase {
  constructor(
    private readonly statusOrderRepository: StatusOrderRepository
  ) {}

  async execute(
    filters: GetAllSalesStoreFilters = {}
  ): Promise<ResponseOrderStatusType> {
    try {
      const fromDate = filters.fromDate?.trim()
      const toDate = filters.toDate?.trim()

      // Se requieren ambas fechas o ninguna.
      if (Boolean(fromDate) !== Boolean(toDate)) {
        throw new Error('DATE_RANGE_REQUIRES_BOTH_DATES')
      }

      if (fromDate && toDate) {
        const startTimestamp = Date.parse(fromDate)
        const endTimestamp = Date.parse(toDate)

        if (
          !Number.isFinite(startTimestamp) ||
          !Number.isFinite(endTimestamp)
        ) {
          throw new Error('INVALID_DATE_RANGE')
        }

        if (startTimestamp > endTimestamp) {
          throw new Error('INVALID_DATE_RANGE_ORDER')
        }

        // El frontend debe enviar fechas ISO con zona horaria.
        const hasTimezone = (value: string) =>
          /(Z|[+-]\d{2}:\d{2})$/i.test(value)

        if (!hasTimezone(fromDate) || !hasTimezone(toDate)) {
          throw new Error('DATE_TIMEZONE_REQUIRED')
        }
      }

      const dateRange = new DateRange()

      const { start, end } = dateRange.getRange(
        fromDate && toDate
          ? {
              start: fromDate,
              end: toDate
            }
          : undefined
      )

      const orders = await this.statusOrderRepository.getAllByStatusType({
        ...filters,
        search: filters.search?.trim() || undefined,
        fromDate: start,
        toDate: end
      })

      return {
        success: true,
        message: 'Orders retrieved successfully',
        data: orders ?? []
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : String(error),
        data: null
      }
    }
  }
}
