import type { DeliveryRepository } from '../../domain/repositories/delivery.repository'
import { assertDeliveryTerms } from '../../domain/services/delivery-policy'
export class GetSaleDeliveryUseCase<Tx> {
  constructor(private readonly repo: DeliveryRepository<Tx>) {}
  async execute(reference: string, tx?: Tx) {
    const snapshot = await this.repo.findSaleDelivery(reference, tx)
    if (snapshot) assertDeliveryTerms(snapshot)
    // null means no historical snapshot, never assume beneficiary or fee.
    return snapshot
  }
}
