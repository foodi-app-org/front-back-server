/**
 * @file token.service.ts
 * @description Service to handle JWT token generation and verification.
 */

import jwt from 'jsonwebtoken'

/**
 * Payload structure for the JWT.
 */
export interface TokenPayload {
  sub?: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

/**
 * Service for handling JWT tokens.
 */
export class TokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(secret = process.env.JWT_SECRET || 'default_secret', expiresIn = '1h') {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  /**
   * Generates a signed JWT token.
   * @param payload Payload to encode.
   * @returns JWT token.
   */
  generate(payload: TokenPayload): string {
    try {
      return jwt.sign(payload, this.secret, {
        expiresIn: this.expiresIn
      });
    } catch (error) {
      throw new Error('Token generation failed: ' + (error as Error).message);
    }
  }

  /**
   * Verifies and decodes a JWT.
   * @param token - The JWT to verify.
   * @returns The decoded payload.
   * @throws Error if token is invalid or expired.
   */
  verify<T = TokenPayload>(token: string): T {
    if (!token) {
      throw new Error('Token must be provided.');
    }

    try {
      return jwt.verify(token, this.secret) as T;
    } catch (err) {
      throw new Error('Invalid or expired token.');
    }
  }
}
