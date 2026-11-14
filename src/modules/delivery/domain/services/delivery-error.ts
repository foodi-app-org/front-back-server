export class DeliveryError extends Error {
  constructor(public readonly code: 'INVALID_DELIVERY' | 'DELIVERY_NOT_FOUND' | 'DELIVERY_CONFLICT' | 'DELIVERY_FORBIDDEN', message: string) {
    super(message)
    this.name = 'DeliveryError'
  }
}
export const invalid = (message: string): never => { throw new DeliveryError('INVALID_DELIVERY', message) }
