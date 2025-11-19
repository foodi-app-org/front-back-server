import { PaymentMethod } from '../../domain/entities/payment-method.entity'
import { PaymentMethodRepository } from '../../domain/repositories/module.repository'

/**
 * Use case responsible for getting all Modules
 */
export class GetAllPaymentMethodUseCase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository
  ) {}

  async execute(): Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.getAll()
  }
}
