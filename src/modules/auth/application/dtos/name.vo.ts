/**
 * Value Object representing a valid user name.
 */
export class Name {
  private readonly value: string

  constructor(name: string) {
    if (!Name.isValid(name)) {
      throw new Error('Invalid name: must be 2–50 alphabetic characters')
    }
    this.value = name
  }

  /**
   * Validates a name string.
   * @param name - Name to validate
   * @returns true if valid
   */
  static isValid(name: string): boolean {
    return /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{2,50}$/.test(name)
  }

  /**
   * Returns the raw name string.
   * @returns Name string
   */
  getValue(): string {
    return this.value
  }
}
