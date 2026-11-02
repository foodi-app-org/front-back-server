import { buildKpiMetric, roundMoney } from './kpi.math'

describe('kpi.math', () => {
  describe('buildKpiMetric', () => {
    it('computes a positive percentage change', () => {
      const m = buildKpiMetric(150, 100)
      expect(m.percentageChange).toBe(50)
      expect(m.trend).toBe('up')
    })

    it('computes a negative percentage change', () => {
      const m = buildKpiMetric(80, 100)
      expect(m.percentageChange).toBe(-20)
      expect(m.trend).toBe('down')
    })

    it('reports flat when both periods are zero', () => {
      const m = buildKpiMetric(0, 0)
      expect(m.percentageChange).toBe(0)
      expect(m.trend).toBe('flat')
    })

    it('does not divide by zero when previous is zero and current grows', () => {
      const m = buildKpiMetric(42, 0)
      expect(m.percentageChange).toBeNull()
      expect(m.trend).toBe('up')
    })

    it('returns unknown when previous is null (no history)', () => {
      const m = buildKpiMetric(42, null)
      expect(m.percentageChange).toBeNull()
      expect(m.previousValue).toBeNull()
      expect(m.trend).toBe('unknown')
    })

    it('never returns Infinity or NaN', () => {
      const a = buildKpiMetric(Number.POSITIVE_INFINITY, 100)
      expect(Number.isFinite(a.value)).toBe(true)
      const b = buildKpiMetric(100, Number.NaN)
      expect(b.percentageChange).toBeNull()
    })

    it('reports flat for equal values', () => {
      const m = buildKpiMetric(100, 100)
      expect(m.percentageChange).toBe(0)
      expect(m.trend).toBe('flat')
    })
  })

  describe('roundMoney', () => {
    it('rounds to two decimals', () => {
      expect(roundMoney(10.129)).toBe(10.13)
      expect(roundMoney(10.124)).toBe(10.12)
    })
    it('guards non-finite values', () => {
      expect(roundMoney(Number.NaN)).toBe(0)
      expect(roundMoney(Number.POSITIVE_INFINITY)).toBe(0)
    })
  })
})
