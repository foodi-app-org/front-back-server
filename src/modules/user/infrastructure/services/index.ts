import { FindUserByEmailUseCase, FindUserByIdUseCase } from '../../application'
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase'
import { SequelizeUserRepository } from '../repositories/sequelize-user.controller.repository'
import { BcryptEncrypterService } from './encrypter.service'
import { JwtTokenService } from './jwt-token.service'

// Infraestructura
const userRepository = new SequelizeUserRepository()
const encrypter = new BcryptEncrypterService()
const tokenService = new JwtTokenService()

// Casos de uso
const createUserUseCase = new CreateUserUseCase(
    userRepository,
    tokenService,
    encrypter
)

const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository)

const findUserByIdUseCase = new FindUserByIdUseCase(userRepository)

// Servicio exportable
export const UserServices = {
    create: createUserUseCase,
    findByEmail: findUserByEmailUseCase,
    findById: findUserByIdUseCase,
}
