import { PaymentMethod } from '../entities/payment-method.entity'


/**
 * Interface for the Module repository.
 */
export interface PaymentMethodRepository {
  /**
   * Creates a new PaymentMethod in the data source.
   * @param paymentMethod - PaymentMethod entity to be created.
   * @returns The created PaymentMethod or null if failed.
   */
  create(paymentMethod: PaymentMethod): Promise<PaymentMethod | null>;

  getAll(): Promise<PaymentMethod[]>;

  getOneById(id: string): Promise<PaymentMethod | null>;
}
