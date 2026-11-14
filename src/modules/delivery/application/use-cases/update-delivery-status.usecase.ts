import type { DeliveryRepository } from '../../domain/repositories/delivery.repository'
import type { DeliveryStatus } from '../../domain/entities/sale-delivery.entity'
import { DeliveryError } from '../../domain/services/delivery-error'
import { assertTransition } from '../../domain/services/delivery-policy'
/** Operational tracking ONLY. No refund, reversal, or ledger settlement. */
export class UpdateDeliveryStatusUseCase<Tx> {
  constructor(private readonly repo: DeliveryRepository<Tx>) {}
  async execute(reference: string, expected: DeliveryStatus, next: DeliveryStatus, actor: string) {
    assertTransition(expected, next)
    const result = await this.repo.changeStatus(reference, expected, next, actor)
    if (!result) throw new DeliveryError('DELIVERY_CONFLICT', 'Entrega no encontrada o estado modificado')
    return result
  }
}
