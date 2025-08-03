import { User } from "../../domain/entities/user.entity"
import { v4 as uuidv4 } from 'uuid'
import { CreateUserDto } from "../dtos/create-user.dto"
import { UserRepository } from "../../domain/repositories/user.repository"

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(name: CreateUserDto['name'], email: CreateUserDto['email']): Promise<User> {
    const existing = await this.userRepository.findByEmail(email)
    if (existing) throw new Error('User already exists')

    const user = new User(uuidv4(), name, email, new Date() as any, new Date())
    await this.userRepository.create(user)
    return user
  }
}