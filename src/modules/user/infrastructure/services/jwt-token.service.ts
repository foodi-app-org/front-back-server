/**
 * @file jwt-token.service.ts
 * @description JWT token implementation of the TokenGenerator interface.
 */

import jwt, { Secret, SignOptions } from 'jsonwebtoken'

import { TokenGenerator, TokenPayload } from '../../domain/interfaces/token-generator.interface'

export class JwtTokenService implements TokenGenerator {
  private readonly secret: Secret
  private readonly expiresIn: string

  constructor() {
    this.secret = process.env.JWT_SECRET ?? 'default_secret'
    this.expiresIn = '1h'
  }

  generate(payload: TokenPayload): string {
    try {
      const options: SignOptions = { expiresIn: this.expiresIn as unknown as number }
      return jwt.sign(payload, this.secret, options)
    } catch (error) {
      throw new Error('Token generation failed: ' + (error as Error).message)
    }
  }

  verify<T = TokenPayload>(token: string): T {
    if (!token) throw new Error('Token must be provided.')
    try {
      return jwt.verify(token, this.secret) as T
    } catch {
      throw new Error('Invalid or expired token.')
    }
  }
}
