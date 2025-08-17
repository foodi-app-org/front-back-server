import { User } from '../../domain/entities/user.entity'
import { UserRepository } from '../../domain/repositories/user.repository'

/**
 * Use case for finding a user by id
 */
export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    return await this.userRepository.findById(id)
  }
}
