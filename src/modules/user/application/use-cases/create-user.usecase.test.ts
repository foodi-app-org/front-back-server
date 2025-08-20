/**
 * @file create-user.use-case.spec.ts
 * @description Unit test for CreateUserUseCase logic.
 */

import { User } from '../../domain/entities/user.entity'
import { Encrypter } from '../../domain/interfaces/encrypter.interface'
import { TokenGenerator } from '../../domain/interfaces/token-generator.interface'
import { UserRepository } from '../../domain/repositories/user.repository'
import { CreateUserUseCase } from './create-user.usecase'

describe('CreateUserUseCase', () => {
  const mockUserRepo: jest.Mocked<UserRepository> = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    // si tienes más métodos declarados en la interfaz los agregas como mocks vacíos
  }

  const mockEncrypter: jest.Mocked<Encrypter> = {
    hash: jest.fn(),
    compare: jest.fn(),
  }

  const mockTokenService: jest.Mocked<TokenGenerator> = {
    generate: jest.fn(),
    verify: jest.fn(),
  }

  const useCase = new CreateUserUseCase(mockUserRepo, mockTokenService, mockEncrypter)

  const name = 'Test User'
  const email = 'test@example.com'
  const password = '123456'
  const hashedPassword = 'hashedPassword123'
  const fakeToken = 'fakeToken123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return error response if user already exists', async () => {
    mockUserRepo.findByEmail.mockResolvedValueOnce({} as User)

    const result = await useCase.execute(name, email, password)

    expect(result.success).toBe(false)
    expect(result.message).toBe('usuario ya existe')
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email)
    expect(mockUserRepo.create).not.toHaveBeenCalled()
    expect(mockTokenService.generate).not.toHaveBeenCalled()
  })

  it('should create user, hash password and return success response', async () => {
    mockUserRepo.findByEmail.mockResolvedValueOnce(null)
    mockEncrypter.hash.mockResolvedValueOnce(hashedPassword)
    mockTokenService.generate.mockReturnValueOnce(fakeToken)

    const result = await useCase.execute(name, email, password)

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email)
    expect(mockEncrypter.hash).toHaveBeenCalledWith(password)
    expect(mockUserRepo.create).toHaveBeenCalledWith(expect.any(User))
    expect(mockTokenService.generate).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: expect.any(String),
        email,
        name
      })
    )

    expect(result.success).toBe(true)
    expect(result.token).toBe(fakeToken)
    expect(result.message).toBe(`Bienvenido ${name}`)
    expect(result.user).toBeInstanceOf(User)
  })

  it('should throw if hashing fails', async () => {
    mockUserRepo.findByEmail.mockResolvedValueOnce(null)
    mockEncrypter.hash.mockRejectedValueOnce(new Error('Hash error'))

    await expect(useCase.execute(name, email, password)).rejects.toThrow('Hash error')

    expect(mockEncrypter.hash).toHaveBeenCalledWith(password)
  })

  it('should throw if token generation fails', async () => {
    mockUserRepo.findByEmail.mockResolvedValueOnce(null)
    mockEncrypter.hash.mockResolvedValueOnce(hashedPassword)
    mockTokenService.generate.mockImplementationOnce(() => {
      throw new Error('Token error')
    })

    await expect(useCase.execute(name, email, password)).rejects.toThrow('Token error')
  })
})
