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
    if (existing) {
      const token = this.tokenService.generate({
        sub: String(existing?.id),
        email: String(existing?.email),
        name: String(existing?.name)
      })
      // generate refreshToken 
      const refreshToken = this.tokenService.generateRefreshToken({
        sub: String(existing?.id),
        email: String(existing?.email),
        name: String(existing?.name)
      })
      return {
        token,
        message: `Bienvenido ${existing.name ?? existing.email}`,
        user: {
          ...existing,
          password: ''
        },
        success: false,
        admin: false,
        isVerifyEmail: false,
        refreshToken
      }
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

    const refreshToken = this.tokenService.generateRefreshToken({
      sub: String(user?.id),
      email: String(user?.email),
      name: String(user?.name)
    })

    return {
      user: {
        ...user,
        password: ''
      },
      token,
      success: true,
      message: `Bienvenido ${user.name ?? user.email}`,
      admin: false,
      isVerifyEmail: false,
      refreshToken
    }
  }
}