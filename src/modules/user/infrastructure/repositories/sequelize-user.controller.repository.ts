// infrastructure/repositories/sequelize-user.repository.ts

import { v4 as uuid } from 'uuid'

import { User } from '../../domain/entities/user.entity'
import { UserRepository } from '../../domain/repositories/user.repository'
import { SequelizeUserModel } from './sequelize-model'

export class SequelizeUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const created = await SequelizeUserModel.create({
      id: uuid(),
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return new User(created.id, created.name, created.email, created.password, created.updatedAt)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await SequelizeUserModel.findOne({ where: { email } })
    if (!user) return null
    return new User(user.id, user.name, user.email, user.password, user.updatedAt)
  }
}
