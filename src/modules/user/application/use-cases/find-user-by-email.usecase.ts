import { UserRepository } from '../../domain/repositories/user.repository'
import { User } from '../../domain/entities/user.entity'

/**
 * Use case for finding a user by email.
 */
export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email)
  }
}
