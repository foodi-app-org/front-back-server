export class NotFountError extends Error {
  constructor (message) {
    super(message)
    this.name = message
  }
}
