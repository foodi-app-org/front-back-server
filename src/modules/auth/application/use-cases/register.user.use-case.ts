import { v4 as uuidv4 } from 'uuid'

import { User, UserRepository } from '../../../user'
import { Encrypter } from '../../domain/interfaces/encrypter.interface'
import { TokenGenerator } from '../../domain/interfaces/token-generator.interface'
// import { TokenService } from '../../infrastructure/services/jwt-token.service'

/**
 * Use case for registering a new user.
 */
export class RegisterUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly encrypter: Encrypter,
        private readonly tokenService: TokenGenerator
    ) { }

    /**
     * Executes user registration flow
     * @param input - User data
     * @returns Registered user + access token
     * @throws Error if user already exists or input is invalid
     */
    async execute(input: {
        name: string
        email: string
        password: string
    }): Promise<{ user: User; accessToken: string }> {
        const name = input.name
        const email = input.email
        const password = input.password

        const exists = await this.userRepository.findByEmail(email)
        if (exists) throw new Error('User already exists')

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

        const accessToken = this.tokenService.generate({
            id: user.id,
            email: email,
            name: name
        })

        return { user, accessToken: accessToken }
    }
}
