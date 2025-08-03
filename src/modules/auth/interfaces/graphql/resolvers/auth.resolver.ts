import { CreateUserUseCase } from '../../../../user'
import { SequelizeUserRepository } from '../../../../user/infrastructure/repositories/sequelize-user.controller.repository'
import { CreateUserInput } from '../inputs'

const userRepository = new SequelizeUserRepository()
const createUserUseCase = new CreateUserUseCase(userRepository)

export const authResolvers = {
  Query: {
  },
  Mutation: {
    registerUser: async (_: any, args: CreateUserInput ) => {
      const { name, email } = args
      return await createUserUseCase.execute(name, email)
    }
  }
}
