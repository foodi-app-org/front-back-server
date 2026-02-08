import { Cities } from '../entities/cities.entity'

/**
 * Repository contract for CitiesRepository operations
 */
export interface CitiesRepository {
  /**
 * Retrieves all Cities.
 * @returns Array of Cities entities.
 */
  getAll(): Promise<Cities[] | null>

  getCitiesByDepartment(dId: string): Promise<Cities[] | null>
}
