import {
  DEFAULT_TIMEZONE,
  getPeriodRange,
  isValidTimezone,
  PeriodPreset,
  PeriodRangeError
} from '../../../shared/utils/period-range.utils'
import { DashboardFilter } from '../domain/types'

/**
 * Raw dashboard filter input as received from GraphQL (all optional).
 */
export interface RawDashboardFilterInput {
  preset?: string | null
  referenceDate?: string | null
  from?: string | null
  to?: string | null
  timezone?: string | null
  categoryIds?: Array<string | null> | null
  productIds?: Array<string | null> | null
  search?: string | null
  page?: number | null
  pageSize?: number | null
  sortBy?: string | null
  sortDirection?: string | null
}

/** Validation failure for dashboard filter input. */
export class DashboardFilterError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DashboardFilterError'
  }
}

const VALID_PRESETS: PeriodPreset[] = ['day', '15-days', 'month', 'custom']
const MAX_IDS = 200
const MAX_SEARCH_LENGTH = 120
const MAX_PAGE_SIZE = 100
const DEFAULT_PAGE_SIZE = 10
/** Allowlist of recent-orders sortable fields mapped to their physical columns. */
export const RECENT_ORDERS_SORT_ALLOWLIST: Record<string, string> = {
  createdAt: 'createdAt',
  total: 'totalProductsPrice'
}

/**
 * Every accepted `sortBy` token across dashboard queries. Recent-orders use
 * createdAt/total; top-products use units/revenue. A single allowlist keeps
 * validation strict while letting each repository interpret its own fields.
 */
const SORT_BY_ALLOWLIST = new Set([
  ...Object.keys(RECENT_ORDERS_SORT_ALLOWLIST),
  'units',
  'revenue',
  'unitsSold'
])

/**
 * Sanitizes an id array: drops empties, trims, caps length.
 *
 * @param ids - Raw id list.
 * @param field - Field name for error messages.
 * @returns A clean string array, or undefined when empty.
 * @throws {DashboardFilterError} When the array exceeds the allowed size.
 */
const sanitizeIds = (
  ids: Array<string | null> | null | undefined,
  field: string
): string[] | undefined => {
  if (!Array.isArray(ids)) return undefined
  const clean = ids
    .filter((id): id is string => typeof id === 'string' && id.trim() !== '')
    .map((id) => id.trim())
  if (clean.length === 0) return undefined
  if (clean.length > MAX_IDS) {
    throw new DashboardFilterError(`${field} exceeds the maximum of ${MAX_IDS} ids`)
  }
  return clean
}

/**
 * Validates and normalizes raw GraphQL dashboard filter input into a
 * {@link DashboardFilter} with a resolved half-open UTC range.
 *
 * @param input - Raw filter input (may be null/undefined).
 * @returns A fully validated, normalized dashboard filter.
 * @throws {DashboardFilterError} When any field is invalid.
 */
export const normalizeDashboardFilter = (
  input?: RawDashboardFilterInput | null
): DashboardFilter => {
  const raw = input ?? {}

  const preset = (raw.preset ?? 'day') as PeriodPreset
  if (!VALID_PRESETS.includes(preset)) {
    throw new DashboardFilterError(`Invalid preset: ${String(raw.preset)}`)
  }

  const timezone = raw.timezone?.trim() || DEFAULT_TIMEZONE
  if (!isValidTimezone(timezone)) {
    throw new DashboardFilterError(`Invalid timezone: ${String(raw.timezone)}`)
  }

  let range
  try {
    range = getPeriodRange({
      preset,
      referenceDate: raw.referenceDate ?? undefined,
      from: raw.from ?? undefined,
      to: raw.to ?? undefined,
      timezone
    })
  } catch (error) {
    if (error instanceof PeriodRangeError) {
      throw new DashboardFilterError(error.message)
    }
    throw error
  }

  const search = typeof raw.search === 'string' ? raw.search.trim() : undefined
  if (search && search.length > MAX_SEARCH_LENGTH) {
    throw new DashboardFilterError(`search exceeds ${MAX_SEARCH_LENGTH} characters`)
  }

  const page = raw.page != null ? Math.trunc(raw.page) : 1
  if (!Number.isFinite(page) || page < 1) {
    throw new DashboardFilterError('page must be a positive integer')
  }

  let pageSize = raw.pageSize != null ? Math.trunc(raw.pageSize) : DEFAULT_PAGE_SIZE
  if (!Number.isFinite(pageSize) || pageSize < 1) {
    throw new DashboardFilterError('pageSize must be a positive integer')
  }
  pageSize = Math.min(pageSize, MAX_PAGE_SIZE)

  const sortBy = raw.sortBy ?? 'createdAt'
  if (!SORT_BY_ALLOWLIST.has(sortBy)) {
    throw new DashboardFilterError(`sortBy not allowed: ${String(raw.sortBy)}`)
  }

  const sortDirection = (raw.sortDirection ?? 'DESC').toUpperCase()
  if (sortDirection !== 'ASC' && sortDirection !== 'DESC') {
    throw new DashboardFilterError('sortDirection must be ASC or DESC')
  }

  return {
    startAt: range.startAt,
    endAt: range.endAt,
    timezone,
    categoryIds: sanitizeIds(raw.categoryIds, 'categoryIds'),
    productIds: sanitizeIds(raw.productIds, 'productIds'),
    search: search || undefined,
    page,
    pageSize,
    sortBy,
    sortDirection: sortDirection as 'ASC' | 'DESC'
  }
}
