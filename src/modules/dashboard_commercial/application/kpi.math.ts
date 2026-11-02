import { KpiMetric } from '../domain/types'

/**
 * Builds a KPI metric with a safe previous-period comparison.
 *
 * Comparison rules (avoiding Infinity/NaN and false growth claims):
 * - previous null/unknown -> percentageChange null, trend 'unknown'.
 * - previous 0 and current 0 -> 0 %, trend 'flat'.
 * - previous 0 and current > 0 -> percentageChange null (cannot divide by zero),
 *   trend 'up' (growth is real but not expressible as a finite percentage).
 * - otherwise -> rounded percentage, trend by sign.
 *
 * @param value - Current-period value.
 * @param previousValue - Previous-period value, or null when unavailable.
 * @returns A fully populated {@link KpiMetric}.
 */
export const buildKpiMetric = (
  value: number,
  previousValue: number | null
): KpiMetric => {
  const current = Number.isFinite(value) ? value : 0

  if (previousValue === null || !Number.isFinite(previousValue)) {
    return { value: current, previousValue: null, percentageChange: null, trend: 'unknown' }
  }

  if (previousValue === 0) {
    if (current === 0) {
      return { value: current, previousValue: 0, percentageChange: 0, trend: 'flat' }
    }
    return { value: current, previousValue: 0, percentageChange: null, trend: 'up' }
  }

  const rawChange = ((current - previousValue) / Math.abs(previousValue)) * 100
  const percentageChange = Number.isFinite(rawChange)
    ? Math.round(rawChange * 100) / 100
    : null

  let trend: KpiMetric['trend'] = 'flat'
  if (percentageChange === null) trend = 'unknown'
  else if (percentageChange > 0) trend = 'up'
  else if (percentageChange < 0) trend = 'down'

  return { value: current, previousValue, percentageChange, trend }
}

/**
 * Rounds a monetary number to 2 decimals, guarding against float noise.
 *
 * @param value - Raw numeric value.
 * @returns A number rounded to 2 decimal places (0 when non-finite).
 */
export const roundMoney = (value: number): number => {
  if (!Number.isFinite(value)) return 0
  return Math.round(value * 100) / 100
}
