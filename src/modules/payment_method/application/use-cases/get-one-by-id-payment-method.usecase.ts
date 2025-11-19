import { PaymentMethod } from '../../domain/entities/payment-method.entity'
import { PaymentMethodRepository } from '../../domain/repositories/module.repository'

/**
 * Use case responsible for getting all Modules
 */
export class GetOnePaymentMethodByIdUseCase {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository
  ) {}

  async execute(id: string): Promise<PaymentMethod | null> {
    return await this.paymentMethodRepository.getOneById(id)
  }
}
