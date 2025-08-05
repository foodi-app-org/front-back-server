/**
 * Value Object representing a valid email.
 */
export class Email {
    private readonly value: string

    constructor(email: string) {
        if (!Email.isValid(email)) {
            throw new Error('Invalid email format')
        }
        this.value = email
    }

    /**
     * Validates an email address format.
     * @param email - Email to validate
     * @returns true if valid, false otherwise
     */
    static isValid(email: string): boolean {
        return /^[\w.-]+@[\w-]+\.[\w]{2,}$/.test(email)
    }

    /**
     * Gets the email value.
     * @returns Email string
     */
    getValue(): string {
        return this.value
    }
}
