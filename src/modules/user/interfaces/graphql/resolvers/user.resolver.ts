import { FindUserByEmailUseCase } from '../../../application'
import { CreateUserUseCase } from '../../../application/use-cases/create-user.usecase'
import { SequelizeUserRepository } from '../../../infrastructure/repositories/sequelize-user.controller.repository'
import { CreateUserInput } from '../inputs'

const userRepository = new SequelizeUserRepository()
const createUserUseCase = new CreateUserUseCase(userRepository)
const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository)

export const userResolvers = {
  Query: {
    getUserByEmail: async (_: any, args: { email: string }) => {
      return await findUserByEmailUseCase.execute(args.email)
    }
  },
  Mutation: {
    createUser: async (_: any, args: { input: CreateUserInput }) => {
      const { name, email } = args.input
      return await createUserUseCase.execute(name, email)
    }
  }
}
