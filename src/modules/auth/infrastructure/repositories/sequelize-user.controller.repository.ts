// infrastructure/repositories/sequelize-user.repository.ts

import { User } from '../../../user'
import SequelizeUserModel from '../../../user/infrastructure/repositories/sequelize-model'
import { UserRegisterRepository } from '../../domain/repositories/auth.repository'
import { v4 as uuid } from 'uuid'

export class SequelizeUserRepository implements UserRegisterRepository {
  async create(user: User): Promise<User> {
    const created = await SequelizeUserModel.create({
      id: uuid(),
      name: user.name,
      email: user.email,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return new User(created.id, created.name, created.email, created.createdAt as any, created.updatedAt)
  }

//   async findByEmail(email: string): Promise<User | null> {
//     const user = await SequelizeUserModel.findOne({ where: { email } })
//     if (!user) return null
//     return new User(user.id, user.name, user.email, user.createdAt as any, user.updatedAt)
//   }
}
