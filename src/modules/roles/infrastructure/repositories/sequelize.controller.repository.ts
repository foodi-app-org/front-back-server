
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Role } from '../../domain/entities/roles.entity'
import { IRoleRepository } from '../../domain/repositories/roles.repository'

export class SequelizeStatusOrderRepository implements IRoleRepository {

  async create(data: Omit<Role, 'createdAt' | 'updatedAt'>): Promise<Role> {
    try {
      const created = await models.Role.create({
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
  // async findById(id: string, transaction?: Transaction): Promise<Role | null> {
  //   try {
  //     const role = await models.Role.findByPk(id, { transaction })
  //     return role
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       throw new Error(e.message)
  //     }
  //     throw new Error(String(e))
  //   }
  // }
  // async findAll(transaction?: Transaction): Promise<Role[]> {
  //   try {
  //     const roles = await models.Role.findAll({ transaction })
  //     return roles
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       throw new Error(e.message)
  //     }
  //     throw new Error(String(e))
  //   }
  // }
  // async update(id: string, data: Partial<Role>, transaction?: Transaction): Promise<Role | null> {
  //   try {
  //     const role = await models.Role.findByPk(id, { transaction })
  //     if (!role) return null
  //     const updatedRole = await role.update(data, { transaction })
  //     return updatedRole
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       throw new Error(e.message)
  //     }
  //     throw new Error(String(e))
  //   }
  // }
  // async delete(id: string, transaction?: Transaction): Promise<void> {
  //   try {
  //     const role = await models.Role.findByPk(id, { transaction })
  //     if (!role) return
  //     await role.destroy({ transaction })
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       throw new Error(e.message)
  //     }
  //     throw new Error(String(e))
  //   }
  // }
}