/**
 * @file jwt-token.service.ts
 * @description JWT token implementation of the TokenGenerator interface.
 */

import { randomUUID } from 'node:crypto'

import jwt, { Secret, SignOptions } from 'jsonwebtoken'

import { TokenGenerator, TokenPayload } from '../../domain/interfaces/token-generator.interface'

/**
 * Discriminates the purpose of a JWT so an access token can never be used as a
 * refresh token (and vice versa), even if both are signed with the same key.
 */
export type TokenType = 'access' | 'refresh'

export class JwtTokenService implements TokenGenerator {
  private readonly secret: Secret
  private readonly refreshSecret: Secret
  private readonly expiresIn: string
  private readonly refreshExpiresInSeconds: number

  constructor() {
    this.secret = process.env.JWT_SECRET ?? 'default_secret'
    // Separate secret for refresh tokens. Falls back to JWT_SECRET so existing
    // dev environments keep working; the `type` claim still isolates purposes.
    this.refreshSecret = process.env.JWT_REFRESH_SECRET ?? this.secret
    this.expiresIn = '1d'
    this.refreshExpiresInSeconds = Number(process.env.REFRESH_TOKEN_EXPIRY ?? 60 * 60 * 24 * 7)
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
      return jwt.sign({ ...payload, type: 'access' as TokenType }, this.secret, options)
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
   * Generates a refresh token with a longer expiration time, signed with the
   * refresh secret and tagged with a `refresh` type claim.
   * @param payload - The payload to include in the refresh token.
   * @returns A signed JWT refresh token.
   */
  generateRefreshToken(payload: TokenPayload): string {
    try {
      const options: SignOptions = { expiresIn: this.refreshExpiresInSeconds }
      // `jti` makes every refresh token unique even when generated within the
      // same second with an identical payload, so rotation always yields a new
      // token (and its hash differs), which reuse detection relies on.
      return jwt.sign(
        { ...payload, type: 'refresh' as TokenType, jti: randomUUID() },
        this.refreshSecret,
        options
      )
    } catch (error) {
      throw new Error('Refresh token generation failed: ' + (error as Error).message)
    }
  }

  /**
   * Verifies a refresh token with the refresh secret and enforces that the
   * `type` claim is `refresh`, so an access token can never be used to refresh.
   * @param token - The refresh JWT to verify.
   * @returns The decoded payload if valid.
   * @throws Error if the token is invalid, expired or not a refresh token.
   */
  verifyRefresh<T = TokenPayload>(token: string): T {
    if (!token) throw new Error('Refresh token must be provided.')
    const decoded = jwt.verify(token, this.refreshSecret) as TokenPayload & { type?: TokenType }
    if (decoded?.type !== 'refresh') {
      throw new Error('Invalid token type.')
    }
    return decoded as T
  }

  /**
   * Refresh token lifetime in seconds (sliding window).
   * @returns Seconds until a freshly issued refresh token expires.
   */
  getRefreshExpiresInSeconds(): number {
    return this.refreshExpiresInSeconds
  }
}
