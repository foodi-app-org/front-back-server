import { DashboardFilterError, normalizeDashboardFilter } from './filters.validator'

describe('normalizeDashboardFilter', () => {
  it('defaults to today/day in America/Bogota when no input is provided', () => {
    const filter = normalizeDashboardFilter(null)
    expect(filter.timezone).toBe('America/Bogota')
    expect(filter.startAt < filter.endAt).toBe(true)
    expect(filter.page).toBe(1)
    expect(filter.pageSize).toBe(10)
    expect(filter.sortBy).toBe('createdAt')
    expect(filter.sortDirection).toBe('DESC')
  })

  it('resolves a month range', () => {
    const filter = normalizeDashboardFilter({ preset: 'month', referenceDate: '2026-02-15' })
    expect(filter.startAt).toBe('2026-02-01T05:00:00.000Z')
    expect(filter.endAt).toBe('2026-03-01T05:00:00.000Z')
  })

  it('caps pageSize at 100', () => {
    const filter = normalizeDashboardFilter({ pageSize: 5000 })
    expect(filter.pageSize).toBe(100)
  })

  it('trims and drops empty category ids', () => {
    const filter = normalizeDashboardFilter({ categoryIds: [' a ', '', null, 'b'] })
    expect(filter.categoryIds).toEqual(['a', 'b'])
  })

  it('rejects an invalid preset', () => {
    expect(() => normalizeDashboardFilter({ preset: 'decade' })).toThrow(DashboardFilterError)
  })

  it('rejects an invalid timezone', () => {
    expect(() => normalizeDashboardFilter({ timezone: 'Mars/Phobos' })).toThrow(DashboardFilterError)
  })

  it('rejects a sortBy outside the allowlist', () => {
    expect(() => normalizeDashboardFilter({ sortBy: 'DROP TABLE' })).toThrow(DashboardFilterError)
  })

  it('rejects a non-positive page', () => {
    expect(() => normalizeDashboardFilter({ page: 0 })).toThrow(DashboardFilterError)
  })

  it('rejects an inverted custom range', () => {
    expect(() =>
      normalizeDashboardFilter({ preset: 'custom', from: '2026-03-10', to: '2026-03-01' })
    ).toThrow(DashboardFilterError)
  })

  it('rejects an over-long search string', () => {
    expect(() => normalizeDashboardFilter({ search: 'x'.repeat(200) })).toThrow(DashboardFilterError)
  })
})
