
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { CreateUserUseCase } from '../../../user/index'
import { SequelizeUserRepository } from '../../../user/infrastructure/repositories/sequelize-user.controller.repository'
import { LoginUserUseCase } from '../../auth.module'
import { BcryptEncrypterService } from './encrypter.service'
import { JwtTokenService } from './jwt-token.service'

const userRepository = new SequelizeUserRepository(MigrationFolder.Public)
const encrypter = new BcryptEncrypterService()
const tokenService = new JwtTokenService()

const createUserUseCase = new CreateUserUseCase(userRepository, tokenService, encrypter)
const loginUserUseCase = new LoginUserUseCase(userRepository, tokenService, encrypter)

export const AuthServices = {
    createUser: createUserUseCase,
    loginUser: loginUserUseCase
}