/**
 * @file encrypter.service.ts
 * @description Service to hash and compare passwords using bcrypt.
 */

import bcrypt from 'bcryptjs'

/**
 * Service for password encryption and validation.
 */
export class EncrypterService {
  private readonly saltRounds = 10;

  /**
   * Hash a plain text password.
   * @param plainPassword - The raw password.
   * @returns The hashed password.
   */
  async hash(plainPassword: string): Promise<string> {
    if (!plainPassword) {
      throw new Error('Password must be provided for hashing.');
    }

    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  /**
   * Compare a plain password with a hashed one.
   * @param plainPassword - Raw password.
   * @param hashedPassword - Hashed password from DB.
   * @returns True if they match, false otherwise.
   */
  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    if (!plainPassword || !hashedPassword) {
      throw new Error('Both passwords must be provided for comparison.');
    }

    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
