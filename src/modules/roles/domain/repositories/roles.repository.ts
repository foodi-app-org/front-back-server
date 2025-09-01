import { Role } from '../entities/roles.entity'

/**
 * Repository contract for StatusTypesOrderTypesRepository operations
 */
export interface IRoleRepository {
  create(data: Omit<Role, 'createdAt' | 'updatedAt'>): Promise<Role>
  findById(id: string): Promise<Role | null>
  // findAll(): Promise<Role[]>
  // update(id: string, payload: Partial<Role>): Promise<Role | null>
  // delete(id: string): Promise<boolean>
}
