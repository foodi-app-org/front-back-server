// infrastructure/repositories/sequelize-user.repository.ts

import { v4 as uuid } from 'uuid'

import { User } from '../../../user'
import { SequelizeUserModel } from '../../../user/infrastructure/db/sequelize/models/sequelize-user.model'
import { UserRegisterRepository } from '../../domain/repositories/auth.repository'

export class SequelizeUserRepository implements UserRegisterRepository {
  async create(user: User): Promise<User> {
    const created = await SequelizeUserModel.create({
      id: uuid(),
      name: user.name,
      email: user.email,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return new User(created.id, created.name, created.email, created.password, created.createdAt, created.updatedAt)
  }
}
