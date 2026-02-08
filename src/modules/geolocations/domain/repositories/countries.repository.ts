import { Transaction } from 'sequelize'

import { Countries } from '../entities/countries.entity'

/**
 * Repository contract for CountriesRepository operations
 */
export interface CountriesRepository {
  create(data: Countries, transaction?: Transaction): Promise<Countries | null>
  /**
 * Retrieves all Countries.
 * @returns Array of Countries entities.
 */
  getAll(): Promise<Countries[] | null>
  // findCodeRef(pCodeRef: string): Promise<Countries | null>
  // findById(id: string): Promise<Countries | null>
  // sumPrice(id: string): Promise<number | null>
}
