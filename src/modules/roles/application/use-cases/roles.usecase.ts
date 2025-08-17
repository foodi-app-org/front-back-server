import { Role } from '../../domain/entities/roles.entity'
import { IRoleRepository } from '../../domain/repositories/roles.repository'

/**
 * Role use cases with business logic orchestration.
 */
export class RoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async createRole(data: Omit<Role, 'idRole' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    return this.roleRepository.create(data)
  }

  async getRoleById(id: string): Promise<Role | null> {
    return this.roleRepository.findById(id)
  }

  async listRoles(): Promise<Role[]> {
    return this.roleRepository.findAll()
  }

  async updateRole(id: string, payload: Partial<Role>): Promise<Role | null> {
    return this.roleRepository.update(id, payload)
  }

  async deleteRole(id: string): Promise<boolean> {
    return this.roleRepository.delete(id)
  }
}
