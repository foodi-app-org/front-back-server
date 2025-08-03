/**
 * @file login-user.use-case.ts
 * @description UseCase responsible for authenticating a user.
 */

import { User } from '../../../user'
import { UserRepository } from '../../../user/domain/repositories/user.repository'
import { Encrypter } from '../../domain/interfaces/encrypter.interface'
import { TokenGenerator } from '../../domain/interfaces/token-generator.interface'

/**
 * LoginUserUseCase handles the user authentication logic.
 */
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenGenerator,
    private readonly encrypter: Encrypter
  ) { }

  /**
   * Executes the user login flow.
   * @param email - User email.
   * @param password - Raw password.
   * @returns A token if login succeeds or throws an error.
   * @throws Error if credentials are invalid or user doesn't exist.
   */
  async execute(email: string, password: string): Promise<{ token: string, user: Partial<User> }> {
    try {

      if (!email || !password) {
        throw new Error('Email and password are required.')
      }

      const user = await this.userRepository.findByEmail(email)
      if (!user) {
        throw new Error('Invalid credentials.')
      }
      const isPasswordValid = await this.encrypter.compare(password, user.password)
      if (!isPasswordValid) {
        throw new Error('Invalid credentials.')
      }
      const token = this.tokenService.generate({
        sub: user.id,
        email: user.email,
        name: user.name
      })

      return {
        token,
        user
      }
    }
    catch (e) {
      const message = e instanceof Error ? e.message : 'Unexpected error';
      throw new Error(`[UserModule] ${message}`);
    }
  }
}
