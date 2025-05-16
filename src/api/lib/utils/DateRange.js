import { DateTime } from 'luxon'

/**
 * Class to compute UTC edges (start/end) of a given local day.
 */
class DateRange {
  /**
   * @param {Date|string|number} [date=new Date()]
   * @param {number} [offset=-5] Timezone offset in hours (e.g., -5 for UTC−5).
   */
  constructor (date = new Date(), offset = -5) {
    this.offset = offset
    this.localDate = DateTime.fromJSDate(
      date instanceof Date ? date : new Date(date),
      { zone: `UTC${offset >= 0 ? '+' : ''}${offset}` }
    )
  }

  /**
   * Build a UTC Date at the start or end of the *local* day.
   * @param {boolean} isEnd
   * @returns {Date}
   */
  getDayEdge (isEnd = false) {
    const d = isEnd
      ? this.localDate.endOf('day').toJSDate()
      : this.localDate.startOf('day').toJSDate()
    return d
  }

  /** @returns {Date} UTC Date at local‑day start. */
  getStartOfDay () {
    return this.getDayEdge(false)
  }

  /** @returns {Date} UTC Date at local‑day end. */
  getEndOfDay () {
    return this.getDayEdge(true)
  }

  /**
   * Convert arbitrary date input to a local day boundary and return UTC date.
   * @param {Date|string|number} input
   * @param {boolean} isEnd
   * @returns {Date}
   */
  parseToDayEdge (input, isEnd = false) {
    const date = input instanceof Date ? input : new Date(input)

    const localDate = DateTime.fromJSDate(date, {
      zone: `UTC${this.offset >= 0 ? '+' : ''}${this.offset}`
    })

    return isEnd
      ? localDate.endOf('day').toJSDate()
      : localDate.startOf('day').toJSDate()
  }

  /**
   * Get formatted string range:
   * "YYYY-MM-DD HH:mm:ss.SSS +00:00"
   * @returns {{start: string, end: string}}
   */
  getRange ({
    start,
    end
  } = {}) {
    const startDate = start
      ? this.parseToDayEdge(start, false)
      : this.getStartOfDay()

    const endDate = end
      ? this.parseToDayEdge(end, true)
      : this.getEndOfDay()

    return {
      start: this.formatUTC(startDate),
      end: this.formatUTC(endDate)
    }
  }

  /**
   * Format a UTC Date as string: "YYYY-MM-DD HH:mm:ss.SSS +00:00"
   * @param {Date} date
   * @returns {string}
   */
  formatUTC (date) {
    const pad = (n, digits = 2) => String(n).padStart(digits, '0')
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

export default DateRange
