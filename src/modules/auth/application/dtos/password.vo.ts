import bcrypt from 'bcryptjs'

/**
 * Value Object for handling passwords securely.
 */
export class Password {
  private readonly hashedValue: string

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue
  }

  /**
   * Creates a Password VO from a raw password string.
   * @param rawPassword - Plain password
   * @returns Password instance
   */
  static async create(rawPassword: string): Promise<Password> {
    if (!Password.isValid(rawPassword)) {
      throw new Error('Password must be at least 8 characters with letters and numbers')
    }
    const hash = await bcrypt.hash(rawPassword, 10)
    return new Password(hash)
  }

  /**
   * Validates a password string format.
   * @param password - Plain password
   * @returns true if valid
   */
  static isValid(password: string): boolean {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password)
  }

  /**
   * Compares a plain password with the stored hashed one.
   * @param plain - Plain password to compare
   * @returns true if match
   */
  async compare(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.hashedValue)
  }

  /**
   * Returns the hashed password value.
   * @returns Hashed password string
   */
  getHashedValue(): string {
    return this.hashedValue
  }
}
