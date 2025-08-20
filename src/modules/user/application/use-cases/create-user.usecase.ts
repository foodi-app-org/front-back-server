import { v4 as uuidv4 } from 'uuid'

import { CreateUserResponse, User } from '../../domain/entities/user.entity'
import { Encrypter } from '../../domain/interfaces/encrypter.interface'
import { TokenGenerator } from '../../domain/interfaces/token-generator.interface'
import { UserRepository } from '../../domain/repositories/user.repository'
import { CreateUserDto } from '../dtos/create-user.dto'


export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenGenerator,
    private readonly encrypter: Encrypter,
  ) { }

  async execute(
    name: CreateUserDto['name'],
    email: CreateUserDto['email'],
    password: CreateUserDto['password']
  ): Promise<CreateUserResponse> {

    const existing = await this.userRepository.findByEmail(email)

    if (existing) return {
      token: '',
      message: 'usuario ya existe',
      user: null,
      success: false,
      admin: false,
      idStore: '',
      storeUserId: '',
      newRefreshToken: '',
      isVerifyEmail: false,
      userId: '',
      refreshToken: ''
    }

    // const encrypterService = new EncrypterService()
    const hashedPassword = await this.encrypter.hash(password)

    const user = new User(
      uuidv4(),
      name,
      email,
      hashedPassword,
      new Date(),
      new Date()
    )

    await this.userRepository.create(user)
    const token = this.tokenService.generate({
      sub: user.id,
      email: user.email,
      name: user.name
    })
    return {
      user,
      token,
      success: true,
      message: `Bienvenido ${user.name ?? user.email}`,
      admin: false,
      idStore: '',
      storeUserId: '',
      newRefreshToken: '',
      isVerifyEmail: false,
      userId: '',
      refreshToken: ''
    }
  }
}