import { GraphQLResolveInfo } from 'graphql'

import { FindUserByEmailUseCase } from '../../../application'
import { CreateUserUseCase } from '../../../application/use-cases/create-user.usecase'
import { SequelizeUserRepository } from '../../../infrastructure/repositories/sequelize-user.controller.repository'
import { BcryptEncrypterService } from '../../../infrastructure/services/encrypter.service'
import { JwtTokenService } from '../../../infrastructure/services/jwt-token.service'
import { CreateUserInput } from '../inputs'

const userRepository = new SequelizeUserRepository()
const encrypter = new BcryptEncrypterService()
const tokenService = new JwtTokenService()

const createUserUseCase = new CreateUserUseCase(userRepository, tokenService, encrypter)
const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository)

export const userResolvers = {
  Query: {
    getUserByEmail: async (_: GraphQLResolveInfo, args: { email: string }) => {
      return await findUserByEmailUseCase.execute(args.email)
    }
  },
  Mutation: {
    createUser: async (_: GraphQLResolveInfo, args: { input: CreateUserInput }) => {
      const {
        name,
        email,
        password,
      } = args.input
      return await createUserUseCase.execute(name, email, password)
    }
  }
}
