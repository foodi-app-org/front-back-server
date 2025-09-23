
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { FindUserByEmailUseCase, FindUserByIdUseCase } from '../../application'
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase'
import { SequelizeUserRepository } from '../../infrastructure/repositories/sequelize-user.controller.repository'
import { BcryptEncrypterService } from '../../infrastructure/services/encrypter.service'
import { JwtTokenService } from '../../infrastructure/services/jwt-token.service'

// Infraestructura
const userRepository = new SequelizeUserRepository(MigrationFolder.Public)
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
    findById: findUserByIdUseCase
}

export const UserServicesTenantFactory = (tenant: string) => {
    const userRepository = new SequelizeUserRepository(getTenantName(tenant))
    return {
        create: new CreateUserUseCase(
            userRepository,
            tokenService,
            encrypter
        ),
        findByEmail: new FindUserByEmailUseCase(userRepository),
        findById: new FindUserByIdUseCase(userRepository)
    }
}