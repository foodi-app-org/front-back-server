
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Role } from '../../domain/entities/roles.entity'
import { IRoleRepository } from '../../domain/repositories/roles.repository'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'


export class SequelizeRolesRepository implements IRoleRepository {
  private readonly tenant: string


  /**
   * @param tenant Optional schema (defaults to MigrationFolder.Public)
   */
  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async create(data: Omit<Role, 'createdAt' | 'updatedAt'>): Promise<Role> {
    try {
      const created = await models.Role.schema(this.tenant).create({
        ...data,
        idStore: data.idStore ?? '', // Ensure idStore is always a string
        priority: data.priority ?? undefined, // Use nullish coalescing operator
        description: data.description ?? undefined, // Ensure description is string | undefined
      })
      return created as Role
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async findById(id: string): Promise<Role | null> {
    try {
      const role = await models.Role.schema(this.tenant).findByPk(id)
      if (!role) return null
      return {
        ...role.toJSON(),
        description: role.description ?? null,
      } as Role
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}
