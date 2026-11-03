
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { CreateUserUseCase } from '../../../user/index'
import { SequelizeUserRepository } from '../../../user/infrastructure/repositories/sequelize-user.controller.repository'
import { LoginUserUseCase } from '../../auth.module'
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case'
import { RevokeTokenUseCase } from '../../application/use-cases/revoke-token.use-case'
import { SequelizeRefreshTokenRepository } from '../repositories/sequelize-refresh-token.repository'
import { BcryptEncrypterService } from './encrypter.service'
import { JwtTokenService } from './jwt-token.service'

const userRepository = new SequelizeUserRepository(MigrationFolder.Public)
const encrypter = new BcryptEncrypterService()
const tokenService = new JwtTokenService()
const refreshTokenRepository = new SequelizeRefreshTokenRepository(MigrationFolder.Public)

const createUserUseCase = new CreateUserUseCase(userRepository, tokenService, encrypter)
const loginUserUseCase = new LoginUserUseCase(userRepository, tokenService, encrypter)
const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, tokenService)
const revokeTokenUseCase = new RevokeTokenUseCase(refreshTokenRepository, tokenService)

export const AuthServices = {
    createUser: createUserUseCase,
    loginUser: loginUserUseCase,
    refreshToken: refreshTokenUseCase,
    revokeToken: revokeTokenUseCase
}

/**
 * Low-level collaborators exposed so interface-layer handlers (controllers)
 * can issue/persist a brand-new refresh family at login using the shared
 * hashing/family conventions.
 */
export const AuthCollaborators = {
    tokenService,
    refreshTokenRepository
}