import { DateTime } from 'luxon'

/**
 * Supported dashboard period presets.
 * - `day`: a single calendar day in the business timezone.
 * - `15-days`: the selected day plus the 14 previous calendar days (15 total).
 * - `month`: the calendar month of the selected day.
 * - `custom`: an explicit inclusive from/to calendar range.
 */
export type PeriodPreset = 'day' | '15-days' | 'month' | 'custom'

/**
 * Granularity used to bucket time-series data.
 */
export type TrendGranularity = 'hour' | 'day' | 'week'

/**
 * A half-open UTC interval `[startAt, endAt)`.
 * `startAt` is inclusive, `endAt` is exclusive. Both are ISO-8601 UTC strings.
 */
export interface UtcRange {
  /** Inclusive lower bound (ISO UTC). */
  startAt: string
  /** Exclusive upper bound (ISO UTC). */
  endAt: string
}

/**
 * Default business timezone used only when no tenant/user timezone is supplied.
 */
export const DEFAULT_TIMEZONE = 'America/Bogota'

const MS_PER_DAY = 24 * 60 * 60 * 1000

/**
 * Validates that a timezone identifier is a usable IANA zone.
 *
 * @param timezone - Candidate IANA timezone (e.g. `America/Bogota`).
 * @returns `true` when Luxon can resolve the zone.
 */
export const isValidTimezone = (timezone: string): boolean => {
  if (typeof timezone !== 'string' || timezone.trim() === '') return false
  return DateTime.local().setZone(timezone).isValid
}

/**
 * Parses a calendar date (ISO date or datetime) into a Luxon DateTime anchored
 * to the given business timezone. Only the calendar day is meaningful; the time
 * part is normalized to the start of that local day.
 *
 * @param value - ISO date/datetime string or Date.
 * @param timezone - IANA business timezone.
 * @returns A DateTime at the start of the local day, or an invalid DateTime.
 */
const toLocalStartOfDay = (value: string | Date, timezone: string): DateTime => {
  if (value instanceof Date) {
    return DateTime.fromJSDate(value, { zone: timezone }).startOf('day')
  }

  const raw = String(value).trim()
  // Prefer the date part to avoid the browser/UTC midnight interpretation trap.
  const dateOnly = raw.slice(0, 10)
  const parsed = DateTime.fromISO(dateOnly, { zone: timezone })
  return parsed.isValid ? parsed.startOf('day') : DateTime.invalid('unparseable-date')
}

/**
 * Error thrown when period inputs are invalid (bad timezone, dates, or range).
 */
export class PeriodRangeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PeriodRangeError'
  }
}

/**
 * Computes the half-open UTC interval `[startAt, endAt)` for a dashboard period.
 *
 * The UI works with calendar dates in the business timezone; this converts those
 * local calendar boundaries to exact UTC instants. A half-open interval is used
 * (never `23:59:59.999`) so consecutive ranges never overlap or drop rows.
 *
 * @param params - Period descriptor.
 * @param params.preset - One of `day`, `15-days`, `month`, `custom`.
 * @param params.referenceDate - Anchor calendar date (ISO). Defaults to "today"
 *   in the business timezone. For `custom`, used only as a fallback.
 * @param params.from - Inclusive start calendar date for `custom`.
 * @param params.to - Inclusive end calendar date for `custom`.
 * @param params.timezone - IANA business timezone. Defaults to `America/Bogota`.
 * @returns A half-open UTC range.
 * @throws {PeriodRangeError} When the timezone, dates, or range are invalid.
 */
export const getPeriodRange = (params: {
  preset: PeriodPreset
  referenceDate?: string | Date
  from?: string | Date
  to?: string | Date
  timezone?: string
}): UtcRange => {
  const timezone = params.timezone ?? DEFAULT_TIMEZONE

  if (!isValidTimezone(timezone)) {
    throw new PeriodRangeError(`Invalid timezone: ${String(params.timezone)}`)
  }

  const nowLocal = DateTime.now().setZone(timezone).startOf('day')
  const reference = params.referenceDate
    ? toLocalStartOfDay(params.referenceDate, timezone)
    : nowLocal

  if (!reference.isValid) {
    throw new PeriodRangeError('Invalid referenceDate')
  }

  let localStart: DateTime
  let localEndExclusive: DateTime

  switch (params.preset) {
    case 'day': {
      localStart = reference
      localEndExclusive = reference.plus({ days: 1 })
      break
    }
    case '15-days': {
      localStart = reference.minus({ days: 14 })
      localEndExclusive = reference.plus({ days: 1 })
      break
    }
    case 'month': {
      localStart = reference.startOf('month')
      localEndExclusive = reference.startOf('month').plus({ months: 1 })
      break
    }
    case 'custom': {
      const fromLocal = params.from
        ? toLocalStartOfDay(params.from, timezone)
        : reference
      const toLocal = params.to
        ? toLocalStartOfDay(params.to, timezone)
        : reference

      if (!fromLocal.isValid || !toLocal.isValid) {
        throw new PeriodRangeError('Invalid custom range dates')
      }
      if (toLocal < fromLocal) {
        throw new PeriodRangeError('Range end must not be before range start')
      }

      localStart = fromLocal
      // End is exclusive: midnight after the final inclusive day.
      localEndExclusive = toLocal.plus({ days: 1 })
      break
    }
    default: {
      throw new PeriodRangeError(`Unsupported period preset: ${String(params.preset)}`)
    }
  }

  return {
    startAt: localStart.toUTC().toISO({ suppressMilliseconds: false }) as string,
    endAt: localEndExclusive.toUTC().toISO({ suppressMilliseconds: false }) as string
  }
}

/**
 * Computes the immediately preceding equivalent range for comparison KPIs.
 *
 * The previous period has the same duration and ends exactly where the current
 * period starts, producing a contiguous, non-overlapping comparison window.
 *
 * @param range - The current half-open UTC range.
 * @returns The previous half-open UTC range of equal duration.
 */
export const getPreviousPeriodRange = (range: UtcRange): UtcRange => {
  const start = DateTime.fromISO(range.startAt, { zone: 'utc' })
  const end = DateTime.fromISO(range.endAt, { zone: 'utc' })

  if (!start.isValid || !end.isValid) {
    throw new PeriodRangeError('Invalid range passed to getPreviousPeriodRange')
  }

  const durationMs = end.toMillis() - start.toMillis()
  const prevStart = start.minus({ milliseconds: durationMs })

  return {
    startAt: prevStart.toUTC().toISO() as string,
    endAt: start.toUTC().toISO() as string
  }
}

/**
 * Chooses a sensible trend granularity for a range duration.
 *
 * @param range - Half-open UTC range.
 * @returns `hour` for single-day ranges, `day` for up to ~45 days, else `week`.
 */
export const resolveGranularity = (range: UtcRange): TrendGranularity => {
  const start = DateTime.fromISO(range.startAt, { zone: 'utc' })
  const end = DateTime.fromISO(range.endAt, { zone: 'utc' })
  const days = Math.round((end.toMillis() - start.toMillis()) / MS_PER_DAY)

  if (days <= 1) return 'hour'
  if (days <= 45) return 'day'
  return 'week'
}

/**
 * Formats an ISO UTC instant into the textual shape persisted by the app in the
 * database: `YYYY-MM-DD HH:mm:ss.SSS +00:00` (space separator, explicit zero
 * offset). This mirrors the existing `DateRange.formatUTC` output so date-bound
 * comparisons line up byte-for-byte with stored `createdAt` values.
 *
 * Why this matters: SQLite stores timestamps as text and compares them
 * lexicographically. Comparing a stored value like `2026-10-03 21:10:15.988
 * +00:00` against an ISO literal like `2026-10-03T05:00:00.000Z` is unreliable
 * because the separators differ (' ' < 'T'), so ranges silently drop rows. On
 * PostgreSQL this text is still a valid timestamp literal. Using the stored
 * format keeps both dialects correct.
 *
 * @param isoUtc - ISO-8601 UTC instant (e.g. the output of getPeriodRange).
 * @returns The DB-comparable UTC string, or the input unchanged when invalid.
 */
export const toStoredUtcFormat = (isoUtc: string): string => {
  const dt = DateTime.fromISO(isoUtc, { zone: 'utc' })
  if (!dt.isValid) return isoUtc
  return dt.toUTC().toFormat('yyyy-MM-dd HH:mm:ss.SSS') + ' +00:00'
}

/**
 * Computes the local-timezone bucket key for a UTC timestamp.
 *
 * Buckets are labelled by their local start so the series renders in the
 * business timezone regardless of how the DB stored the instant.
 *
 * @param isoUtc - UTC timestamp (ISO or Date).
 * @param granularity - Bucketing unit.
 * @param timezone - IANA business timezone.
 * @returns A stable bucket key (ISO-ish) for grouping, or null when invalid.
 */
export const getBucketKey = (
  isoUtc: string | Date,
  granularity: TrendGranularity,
  timezone: string
): string | null => {
  let dt: DateTime
  if (isoUtc instanceof Date) {
    dt = DateTime.fromJSDate(isoUtc, { zone: timezone })
  } else {
    // Accept both ISO (`2026-10-03T05:00:00.000Z`) and the stored DB shape
    // (`2026-10-03 21:10:15.988 +00:00`). Normalize the space separator and the
    // ` +00:00` suffix so Luxon parses either reliably.
    const normalized = String(isoUtc).trim().replace(' ', 'T').replace(' +00:00', 'Z')
    dt = DateTime.fromISO(normalized, { zone: 'utc' }).setZone(timezone)
  }

  if (!dt.isValid) return null

  switch (granularity) {
    case 'hour':
      return dt.startOf('hour').toFormat("yyyy-MM-dd'T'HH:00")
    case 'week':
      return dt.startOf('week').toFormat('yyyy-MM-dd')
    case 'day':
    default:
      return dt.startOf('day').toFormat('yyyy-MM-dd')
  }
}

/**
 * Enumerates every bucket key in a half-open UTC range at the given
 * granularity, expressed in the business timezone. Used to build a continuous
 * zero-filled trend series so the chart/sparkline always spans the full period
 * (e.g. 15 day-buckets for a 15-day range) even when sales land on a single
 * day. Keys match {@link getBucketKey}'s format exactly.
 *
 * @param range - Half-open UTC range `[startAt, endAt)`.
 * @param granularity - Bucketing unit.
 * @param timezone - IANA business timezone.
 * @returns Ordered list of bucket keys covering the range.
 */
export const enumerateBuckets = (
  range: UtcRange,
  granularity: TrendGranularity,
  timezone: string
): string[] => {
  const start = DateTime.fromISO(range.startAt, { zone: 'utc' }).setZone(timezone)
  const end = DateTime.fromISO(range.endAt, { zone: 'utc' }).setZone(timezone)
  if (!start.isValid || !end.isValid) return []

  const unit = granularity === 'hour' ? 'hour' : granularity === 'week' ? 'week' : 'day'
  const keys: string[] = []
  // Cap the number of buckets to avoid pathological ranges producing huge
  // arrays (e.g. an accidental multi-year hourly request).
  const MAX_BUCKETS = 400

  let cursor = start.startOf(unit)
  const limit = end // exclusive upper bound
  while (cursor < limit && keys.length < MAX_BUCKETS) {
    switch (granularity) {
      case 'hour':
        keys.push(cursor.toFormat("yyyy-MM-dd'T'HH:00"))
        break
      case 'week':
        keys.push(cursor.toFormat('yyyy-MM-dd'))
        break
      case 'day':
      default:
        keys.push(cursor.toFormat('yyyy-MM-dd'))
    }
    cursor = cursor.plus({ [`${unit}s`]: 1 })
  }

  return keys
}
