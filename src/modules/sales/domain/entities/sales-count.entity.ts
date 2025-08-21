/**
 * Sales entity representing a sale record.
 */
export class Sale {
  readonly amount: number
  readonly createdAt: Date
  readonly updatedAt: Date

  /**
   * Creates a new Sale entity.
   * @param amount Sale amount in currency.
   * @param createdAt Date when the sale was created.
   * @param updatedAt Date when the sale was last updated.
   */
  constructor(amount: number, createdAt: Date, updatedAt: Date) {
    this.amount = amount
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
