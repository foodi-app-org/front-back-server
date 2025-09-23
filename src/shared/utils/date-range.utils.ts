import { DateTime } from 'luxon'

/**
 * Class to compute UTC edges (start/end) of a given local day.
 */
export class DateRange {
  private readonly offset: number
  private readonly localDate: DateTime

  /**
   * Creates a DateRange instance.
   * @param date Input date (Date). Defaults to now.
   * @param offset Timezone offset in hours (e.g., -5 for UTC−5). Defaults to -5.
   */
  constructor(date: Date = new Date(), offset = -5) {
    this.offset = offset
    this.localDate = DateTime.fromJSDate(
      date,
      { zone: `UTC${offset >= 0 ? '+' : ''}${offset}` }
    )
  }

  /**
   * Build a UTC Date at the start or end of the *local* day.
   * @param isEnd Whether to get end of day. Defaults to false.
   * @returns UTC Date object.
   */
  private getDayEdge(isEnd = false): Date {
    return isEnd
      ? this.localDate.endOf('day').toJSDate()
      : this.localDate.startOf('day').toJSDate()
  }

  /** @returns UTC Date at local-day start. */
  getStartOfDay(): Date {
    return this.getDayEdge(false)
  }

  /** @returns UTC Date at local-day end. */
  getEndOfDay(): Date {
    return this.getDayEdge(true)
  }

  /**
   * Convert arbitrary date input to a local day boundary and return UTC date.
   * @param input Date input (Date | string | number).
   * @param isEnd Whether to return end of day.
   * @returns UTC Date object.
   */
  parseToDayEdge(input: Date | string | number, isEnd = false): Date {
    const date = input instanceof Date ? input : new Date(input)

    const localDate = DateTime.fromJSDate(date, {
      zone: `UTC${this.offset >= 0 ? '+' : ''}${this.offset}`
    })

    return isEnd
      ? localDate.endOf('day').toJSDate()
      : localDate.startOf('day').toJSDate()
  }

  /**
   * Get formatted string range.
   * Format: "YYYY-MM-DD HH:mm:ss.SSS +00:00"
   * @param params Optional start/end dates.
   * @returns Object with formatted `start` and `end` strings.
   */
  getRange(params?: {
    start?: Date | string | number
    end?: Date | string | number
  }): { start: string; end: string } {
    const startDate = params?.start
      ? this.parseToDayEdge(params.start, false)
      : this.getStartOfDay()

    const endDate = params?.end
      ? this.parseToDayEdge(params.end, true)
      : this.getEndOfDay()

    return {
      start: this.formatUTC(startDate),
      end: this.formatUTC(endDate)
    }
  }

  /**
   * Format a UTC Date as string.
   * Example: "YYYY-MM-DD HH:mm:ss.SSS +00:00"
   * @param date UTC Date.
   * @returns Formatted string.
   */
  private formatUTC(date: Date): string {
    const pad = (n: number, digits = 2) => String(n).padStart(digits, '0')
    return (
      `${date.getUTCFullYear()}-` +
      `${pad(date.getUTCMonth() + 1)}-` +
      `${pad(date.getUTCDate())} ` +
      `${pad(date.getUTCHours())}:` +
      `${pad(date.getUTCMinutes())}:` +
      `${pad(date.getUTCSeconds())}.` +
      `${pad(date.getUTCMilliseconds(), 3)} +00:00`
    )
  }
}
