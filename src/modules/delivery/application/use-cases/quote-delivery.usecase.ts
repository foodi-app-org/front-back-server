import type { DeliveryQuoteInput } from '../../domain/entities/sale-delivery.entity'
import type { DeliveryRepository } from '../../domain/repositories/delivery.repository'
import { DeliveryError } from '../../domain/services/delivery-error'
import { quoteDelivery } from '../../domain/services/delivery-policy'
export class QuoteDeliveryUseCase<Tx> {
  constructor(private readonly repo: DeliveryRepository<Tx>) {}
  async execute(input: DeliveryQuoteInput, tx?: Tx) {
    const method = await this.repo.findMethod(input.methodId, tx, tx !== undefined)
    if (!method) throw new DeliveryError('DELIVERY_NOT_FOUND', 'Modalidad no encontrada')
    return quoteDelivery(method, input)
  }
}
