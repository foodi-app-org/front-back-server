import { Departments } from '../entities/departments.entity'

/**
 * Repository contract for DepartmentsRepository operations
 */
export interface DepartmentsRepository {
  /**
 * Retrieves all Departments.
 * @returns Array of Departments entities.
 */
  getAll(): Promise<Departments[] | null>

  getDepartmentsByCountry(cId: string): Promise<Departments[] | null>
}
