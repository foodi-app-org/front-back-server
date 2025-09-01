// infrastructure/repositories/sequelize-user.repository.ts

import { v4 as uuid } from 'uuid'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { User } from '../../domain/entities/user.entity'
import { UserRepository } from '../../domain/repositories/user.repository'
import { SequelizeUserModel } from '../db/sequelize/models/sequelize-user.model'

/**
 * Sequelize implementation of the UserRepository.
 * Handles user persistence and retrieval with optional tenant support.
 */
export class SequelizeUserRepository implements UserRepository {
  private readonly tenant: string

  /**
   * @param tenant Optional schema (defaults to MigrationFolder.Public)
   */
  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  /**
   * Creates a new user in the database.
   * @param user - User entity
   * @returns Created User entity
   */
  async create(user: User): Promise<User> {
    const created = await SequelizeUserModel.schema(this.tenant).create({
      id: uuid(),
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return new User(
      created.id,
      created.name,
      created.email,
      created.password,
      created.createdAt,
      created.updatedAt
    )
  }

  /**
   * Finds a user by email.
   * @param email - User email
   * @returns User entity or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await SequelizeUserModel.schema(this.tenant).findOne({ where: { email } })
    if (!user) return null

    return new User(user.id, user.name, user.email, user.password, user.createdAt, user.updatedAt)
  }

  /**
   * Finds a user by ID.
   * @param id - User ID
   * @returns User entity or null if not found
   */
  async findById(id: string): Promise<User | null> {
    const user = await SequelizeUserModel.schema(this.tenant).findByPk(id)
    if (!user) return null

    return new User(user.id, user.name, user.email, user.password, user.createdAt, user.updatedAt)
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    try {
      const [updated] = await SequelizeUserModel.schema(this.tenant).update(updateData, {
        where: { id }
      })
      return updated ? (await this.findById(id)) : null
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}
