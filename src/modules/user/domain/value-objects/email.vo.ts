export class Email {
  value: string

  constructor(email: string) {
    if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('Invalid email format')
    }
    this.value = email
  }
}
