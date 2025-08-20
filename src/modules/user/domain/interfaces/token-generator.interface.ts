/**
 * @file token-generator.interface.ts
 * @description Interface for token generation and verification.
 */

export interface TokenPayload {
  sub?: string
  email: string
  name: string
  [key: string]: unknown
}

export interface TokenGenerator {
  /**
   * Generates a signed JWT token.
   * @param payload - Payload to encode.
   * @returns JWT token string.
   */
  generate(payload: TokenPayload): string

  /**
   * Verifies and decodes a JWT.
   * @param token - The JWT to verify.
   * @returns Decoded payload.
   */
  verify<T = TokenPayload>(token: string): T

  /**
   * Generates a refresh token.
   * @param payload - Payload to encode.
   * @returns Refresh token string.
   */
  generateRefreshToken(payload: TokenPayload): string
}
