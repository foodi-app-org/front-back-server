/**
 * @file login-user.use-case.ts
 * @description UseCase responsible for authenticating a user.
 */

import { User } from '../../../user';
import { UserRepository } from '../../../user/domain/repositories/user.repository';
import { EncrypterService } from '../../infrastructure/services/encrypter.service';
import { TokenService } from '../../infrastructure/services/token.service';

/**
 * LoginUserUseCase handles the user authentication logic.
 */
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypterService: EncrypterService,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Executes the user login flow.
   * @param email - User email.
   * @param password - Raw password.
   * @returns A token if login succeeds or throws an error.
   * @throws Error if credentials are invalid or user doesn't exist.
   */
  async execute(email: string, password: string): Promise<{ token: string; user: Partial<User> }> {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials.');
    }

    const isPasswordValid = await this.encrypterService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    const token = this.tokenService.generate({
      sub: user.id,
      email: user.email,
      name: user.name
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
}
