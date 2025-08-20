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

  /**
   * Generates a signed JWT token with the provided payload.
   * @param payload - The payload to include in the token.
   * @returns A signed JWT token.
   * @throws Error if the token generation fails.
   */
  generate(payload: TokenPayload): string {
    try {
      const options: SignOptions = { expiresIn: this.expiresIn as unknown as number }
      return jwt.sign(payload, this.secret, options)
    } catch (error) {
      throw new Error('Token generation failed: ' + (error as Error).message)
    }
  }

  /**
   * Verifies the provided token and returns the decoded payload.
   * @param token - The JWT token to verify.
   * @returns The decoded payload if the token is valid.
   * @throws Error if the token is invalid or expired.
   */
  verify<T = TokenPayload>(token: string): T {
    if (!token) throw new Error('Token must be provided.')
    try {
      return jwt.verify(token, this.secret) as T
    } catch {
      throw new Error('Invalid or expired token.')
    }
  }
  /**
   * Generates a refresh token with a longer expiration time.
   * @param payload - The payload to include in the refresh token.
   * @returns A signed JWT refresh token.
   */
  generateRefreshToken(payload: TokenPayload): string {
    try {
      const options: SignOptions = { expiresIn: '7d' }
      return jwt.sign(payload, this.secret, options)

    } catch (error) {
      throw new Error('Refresh token generation failed: ' + (error as Error).message)
    }
  }
}
