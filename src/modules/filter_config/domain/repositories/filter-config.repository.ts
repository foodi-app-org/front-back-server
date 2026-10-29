import { FilterConfig } from '../entities/filter-config.entity'

/**
 * Port for filter-configuration persistence.
 */
export interface FilterConfigRepository {
  /**
   * Returns all filter-config records, optionally scoped to a store.
   */
  getAll(idStore?: string | null): Promise<FilterConfig[]>

  /**
   * Returns a single filter-config record by primary key.
   */
  findById(id: string): Promise<FilterConfig | null>

  /**
   * Persists a new filter-config record.
   */
  create(entity: FilterConfig): Promise<FilterConfig>
}
