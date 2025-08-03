import { GraphQLResolveInfo } from 'graphql'

import { CreateUserUseCase } from '../../../../user'
import { SequelizeUserRepository } from '../../../../user/infrastructure/repositories/sequelize-user.controller.repository'
import { LoginUserUseCase } from '../../../auth.module'
import { BcryptEncrypterService } from '../../../infrastructure/services/encrypter.service'
import { JwtTokenService } from '../../../infrastructure/services/jwt-token.service'
import { AuthUserInput, CreateUserInput } from '../inputs'

const userRepository = new SequelizeUserRepository()
const encrypter = new BcryptEncrypterService();
const tokenService = new JwtTokenService()

const createUserUseCase = new CreateUserUseCase(userRepository, tokenService, encrypter)
const loginUserUseCase = new LoginUserUseCase(userRepository, tokenService, encrypter)

export const authResolvers = {
  Query: {
  },
  Mutation: {
    loginUser: async (_: GraphQLResolveInfo, args: AuthUserInput) => {
      const { 
        uEmail: email,
        uPassword: password,
      }= args
      return await loginUserUseCase.execute(email, password)
    },
    registerUser: async (_: GraphQLResolveInfo, args: CreateUserInput) => {
      const { 
        name,
        email,
        password,
      } = args
      return await createUserUseCase.execute(name, email, password)
    }
  }
}
