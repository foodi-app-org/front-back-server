/**
 * The weekly dashboard uses the modern Colombian civil calendar (UTC-05:00).
 * Dates are calendar labels, while all database boundaries are UTC instants.
 * This rolling report is independent of the dashboard daily filter.
 */
export const WEEKLY_TIMEZONE = 'America/Bogota'
const COLOMBIA_OFFSET_MS = 5 * 60 * 60 * 1000
const DAY_MS = 86_400_000
const GRAPHQL_MAX_INT = 2_147_483_647

export type WeeklyComparisonStatus =
  | 'NO_HISTORY'
  | 'NO_REFERENCE'
  | 'NO_ACTIVITY'
  | 'NEW_ACTIVITY'
  | 'INCREASED'
  | 'DECREASED'
  | 'UNCHANGED'

export interface WeeklyWindow {
  weekStart: string
  weekEnd: string
  startAt: string
  endAt: string
  isCurrent: boolean
}

export interface WeeklyStockSnapshot {
  firstAt: string | Date | null
  totals: number[]
}

export interface WeeklyStockReportRow {
  weekStart: string
  weekEnd: string
  totalOut: number | null
  prevTotalOut: number | null
  percentageChange: number | null
  comparisonStatus: WeeklyComparisonStatus
  isCurrent: boolean
  isPartial: boolean
  historyPartial: boolean
}

const isoDay = (milliseconds: number): string => new Date(milliseconds).toISOString().slice(0, 10)

/** Eight Monday-to-Sunday windows: seven visible, one hidden baseline. */
export const buildWeeklyWindows = (now: Date): WeeklyWindow[] => {
  const nowMs = now.getTime()
  if (!Number.isFinite(nowMs)) throw new Error('Invalid report clock')

  const local = new Date(nowMs - COLOMBIA_OFFSET_MS)
  local.setUTCHours(0, 0, 0, 0)
  const monday = local.getTime() - ((local.getUTCDay() + 6) % 7) * DAY_MS

  return Array.from({ length: 8 }, (_, index) => {
    const start = monday - (7 - index) * 7 * DAY_MS
    const startAt = start + COLOMBIA_OFFSET_MS
    return {
      weekStart: isoDay(start),
      weekEnd: isoDay(start + 6 * DAY_MS),
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(Math.min(startAt + 7 * DAY_MS, nowMs)).toISOString(),
      isCurrent: index === 7
    }
  })
}

const asMillis = (value: string | Date): number => {
  if (value instanceof Date) return value.getTime()
  const normalized = value.trim().replace(' ', 'T').replace(/ \+00:00$/, 'Z')
  // Existing application timestamps without an explicit offset are stored in UTC.
  return Date.parse(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized) ? normalized : normalized + 'Z')
}

interface ObservedWeek {
  total: number | null
  covered: boolean
  partial: boolean
}

/**
 * Observation policy: the first recorded kardex event is a conservative lower
 * bound, not proof that older events never existed or that logging was gap-free.
 * Before that boundary, quantities are unknown. From it onward, missing
 * DECREMENT rows mean zero *recorded* outgoing units. A partial first week can
 * display its actual count but cannot serve as a previous full-week baseline.
 */
export const compareWeeklyStock = (
  windows: WeeklyWindow[],
  snapshot: WeeklyStockSnapshot
): WeeklyStockReportRow[] => {
  if (windows.length !== 8 || snapshot.totals.length !== 8) {
    throw new Error('Invalid weekly stock snapshot')
  }
  const first = snapshot.firstAt === null ? null : asMillis(snapshot.firstAt)
  if (first !== null && !Number.isFinite(first)) {
    throw new Error('Invalid stock history timestamp')
  }

  const buckets: ObservedWeek[] = windows.map((window, index) => {
    const count = snapshot.totals[index]
    if (!Number.isSafeInteger(count) || count < 0 || count > GRAPHQL_MAX_INT) {
      throw new Error('Invalid stock quantity or GraphQL Int overflow')
    }
    const start = Date.parse(window.startAt)
    const end = Date.parse(window.endAt)
    const observed = first !== null && first < end
    if (!observed && count !== 0) throw new Error('Inconsistent stock history snapshot')

    return {
      total: observed ? count : null,
      covered: observed && first !== null && first <= start,
      partial: observed && first !== null && first > start
    }
  })

  return windows.slice(1).map((window, index) => {
    const current = buckets[index + 1]
    const previous = buckets[index]
    const totalOut = current.total
    const prevTotalOut = previous.covered ? previous.total : null
    let percentageChange: number | null = null
    let comparisonStatus: WeeklyComparisonStatus

    if (totalOut === null) {
      comparisonStatus = 'NO_HISTORY'
    } else if (prevTotalOut === null || !current.covered) {
      comparisonStatus = 'NO_REFERENCE'
    } else if (prevTotalOut === 0) {
      comparisonStatus = totalOut === 0 ? 'NO_ACTIVITY' : 'NEW_ACTIVITY'
    } else {
      percentageChange = Math.round(((totalOut - prevTotalOut) / prevTotalOut) * 10_000) / 100
      if (Object.is(percentageChange, -0)) percentageChange = 0
      comparisonStatus = totalOut > prevTotalOut
        ? 'INCREASED'
        : totalOut < prevTotalOut ? 'DECREASED' : 'UNCHANGED'
    }

    return {
      weekStart: window.weekStart,
      weekEnd: window.weekEnd,
      totalOut,
      prevTotalOut,
      percentageChange,
      comparisonStatus,
      isCurrent: window.isCurrent,
      isPartial: window.isCurrent || current.partial,
      historyPartial: current.partial
    }
  })
}
