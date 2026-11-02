import {
  getBucketKey,
  getPeriodRange,
  getPreviousPeriodRange,
  isValidTimezone,
  PeriodRangeError,
  resolveGranularity,
  toStoredUtcFormat
} from './period-range.utils'

const BOGOTA = 'America/Bogota' // UTC-5, no DST
const NY = 'America/New_York' // has DST

describe('period-range.utils', () => {
  describe('isValidTimezone', () => {
    it('accepts valid IANA zones', () => {
      expect(isValidTimezone(BOGOTA)).toBe(true)
      expect(isValidTimezone('UTC')).toBe(true)
    })
    it('rejects invalid zones and empty input', () => {
      expect(isValidTimezone('Not/AZone')).toBe(false)
      expect(isValidTimezone('')).toBe(false)
      // @ts-expect-error testing wrong type
      expect(isValidTimezone(null)).toBe(false)
    })
  })

  describe('getPeriodRange - day', () => {
    it('converts a Bogota day to UTC [00:00, next 00:00) shifted +5h', () => {
      const range = getPeriodRange({ preset: 'day', referenceDate: '2026-02-15', timezone: BOGOTA })
      // Bogota midnight 2026-02-15 == 2026-02-15T05:00:00Z
      expect(range.startAt).toBe('2026-02-15T05:00:00.000Z')
      expect(range.endAt).toBe('2026-02-16T05:00:00.000Z')
    })

    it('does not use 23:59:59.999 (end is exclusive next midnight)', () => {
      const range = getPeriodRange({ preset: 'day', referenceDate: '2026-02-15', timezone: BOGOTA })
      expect(range.endAt.endsWith('05:00:00.000Z')).toBe(true)
    })
  })

  describe('getPeriodRange - 15-days', () => {
    it('includes the selected day plus the 14 previous calendar days', () => {
      const range = getPeriodRange({ preset: '15-days', referenceDate: '2026-01-15', timezone: BOGOTA })
      // start = Jan 1 local -> 2026-01-01T05:00Z ; end exclusive = Jan 16 local
      expect(range.startAt).toBe('2026-01-01T05:00:00.000Z')
      expect(range.endAt).toBe('2026-01-16T05:00:00.000Z')
    })
  })

  describe('getPeriodRange - month', () => {
    it('spans the full calendar month, end exclusive', () => {
      const range = getPeriodRange({ preset: 'month', referenceDate: '2026-02-20', timezone: BOGOTA })
      expect(range.startAt).toBe('2026-02-01T05:00:00.000Z')
      expect(range.endAt).toBe('2026-03-01T05:00:00.000Z')
    })

    it('handles February in a leap year (2024)', () => {
      const range = getPeriodRange({ preset: 'month', referenceDate: '2024-02-10', timezone: BOGOTA })
      expect(range.startAt).toBe('2024-02-01T05:00:00.000Z')
      // March 1 local -> exclusive end confirms Feb had 29 days captured
      expect(range.endAt).toBe('2024-03-01T05:00:00.000Z')
    })

    it('reflects the month of the selected date when it differs', () => {
      const range = getPeriodRange({ preset: 'month', referenceDate: '2026-12-31', timezone: BOGOTA })
      expect(range.startAt).toBe('2026-12-01T05:00:00.000Z')
      expect(range.endAt).toBe('2027-01-01T05:00:00.000Z')
    })
  })

  describe('getPeriodRange - custom', () => {
    it('is inclusive from/to with exclusive end (single day)', () => {
      const range = getPeriodRange({ preset: 'custom', from: '2026-03-10', to: '2026-03-10', timezone: BOGOTA })
      expect(range.startAt).toBe('2026-03-10T05:00:00.000Z')
      expect(range.endAt).toBe('2026-03-11T05:00:00.000Z')
    })

    it('spans across months', () => {
      const range = getPeriodRange({ preset: 'custom', from: '2026-01-28', to: '2026-02-03', timezone: BOGOTA })
      expect(range.startAt).toBe('2026-01-28T05:00:00.000Z')
      expect(range.endAt).toBe('2026-02-04T05:00:00.000Z')
    })

    it('spans across years', () => {
      const range = getPeriodRange({ preset: 'custom', from: '2025-12-30', to: '2026-01-02', timezone: BOGOTA })
      expect(range.startAt).toBe('2025-12-30T05:00:00.000Z')
      expect(range.endAt).toBe('2026-01-03T05:00:00.000Z')
    })

    it('throws when end is before start', () => {
      expect(() =>
        getPeriodRange({ preset: 'custom', from: '2026-03-10', to: '2026-03-01', timezone: BOGOTA })
      ).toThrow(PeriodRangeError)
    })
  })

  describe('getPeriodRange - DST zone', () => {
    it('produces correct local-midnight boundaries across a DST change (NY March 2026)', () => {
      // DST starts 2026-03-08 in the US; local midnights still map to valid UTC.
      const range = getPeriodRange({ preset: 'custom', from: '2026-03-07', to: '2026-03-09', timezone: NY })
      // 2026-03-07 00:00 EST = 05:00Z ; end exclusive 2026-03-10 00:00 EDT = 04:00Z
      expect(range.startAt).toBe('2026-03-07T05:00:00.000Z')
      expect(range.endAt).toBe('2026-03-10T04:00:00.000Z')
    })
  })

  describe('getPeriodRange - errors', () => {
    it('throws on invalid timezone', () => {
      expect(() => getPeriodRange({ preset: 'day', timezone: 'X/Y' })).toThrow(PeriodRangeError)
    })
    it('throws on invalid referenceDate', () => {
      expect(() => getPeriodRange({ preset: 'day', referenceDate: 'not-a-date', timezone: BOGOTA })).toThrow(
        PeriodRangeError
      )
    })
    it('throws on unsupported preset', () => {
      // @ts-expect-error testing invalid preset
      expect(() => getPeriodRange({ preset: 'year', timezone: BOGOTA })).toThrow(PeriodRangeError)
    })
  })

  describe('getPreviousPeriodRange', () => {
    it('returns a contiguous, equal-duration window ending at current start', () => {
      const current = getPeriodRange({ preset: 'day', referenceDate: '2026-02-15', timezone: BOGOTA })
      const previous = getPreviousPeriodRange(current)
      expect(previous.endAt).toBe(current.startAt)
      expect(previous.startAt).toBe('2026-02-14T05:00:00.000Z')
    })

    it('mirrors month duration correctly', () => {
      const current = getPeriodRange({ preset: 'month', referenceDate: '2026-03-10', timezone: BOGOTA })
      const previous = getPreviousPeriodRange(current)
      expect(previous.endAt).toBe(current.startAt)
    })
  })

  describe('resolveGranularity', () => {
    it('hour for a single day', () => {
      const r = getPeriodRange({ preset: 'day', referenceDate: '2026-02-15', timezone: BOGOTA })
      expect(resolveGranularity(r)).toBe('hour')
    })
    it('day for 15 days', () => {
      const r = getPeriodRange({ preset: '15-days', referenceDate: '2026-02-15', timezone: BOGOTA })
      expect(resolveGranularity(r)).toBe('day')
    })
    it('week for a long custom range', () => {
      const r = getPeriodRange({ preset: 'custom', from: '2026-01-01', to: '2026-04-01', timezone: BOGOTA })
      expect(resolveGranularity(r)).toBe('week')
    })
  })

  describe('getBucketKey', () => {
    it('buckets a near-midnight UTC timestamp into the correct local day', () => {
      // 2026-02-16T04:30Z is still 2026-02-15 23:30 in Bogota (UTC-5)
      expect(getBucketKey('2026-02-16T04:30:00.000Z', 'day', BOGOTA)).toBe('2026-02-15')
    })
    it('buckets by hour in local time', () => {
      expect(getBucketKey('2026-02-16T05:30:00.000Z', 'hour', BOGOTA)).toBe('2026-02-16T00:00')
    })
    it('parses the stored DB format (space + +00:00 suffix)', () => {
      // Matches how the app persists createdAt in SQLite/Postgres.
      expect(getBucketKey('2026-10-03 21:10:15.988 +00:00', 'day', BOGOTA)).toBe('2026-10-03')
    })
    it('returns null for invalid input', () => {
      expect(getBucketKey('nope', 'day', BOGOTA)).toBeNull()
    })
  })

  describe('toStoredUtcFormat', () => {
    it('converts ISO UTC to the DB-comparable stored shape', () => {
      expect(toStoredUtcFormat('2026-10-03T05:00:00.000Z')).toBe('2026-10-03 05:00:00.000 +00:00')
    })
    it('round-trips so day filters match stored createdAt lexicographically', () => {
      const start = toStoredUtcFormat('2026-10-03T05:00:00.000Z')
      const end = toStoredUtcFormat('2026-10-04T05:00:00.000Z')
      const stored = '2026-10-03 21:10:15.988 +00:00'
      expect(stored >= start && stored < end).toBe(true)
    })
    it('returns the input unchanged when it is not a valid ISO string', () => {
      expect(toStoredUtcFormat('not-a-date')).toBe('not-a-date')
    })
  })
})
