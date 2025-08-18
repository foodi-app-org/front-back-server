/**
 * Enum for stock movement types.
 */
export enum MovementTypes {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT'
}

/**
 * Entity that represents a Stock Movement in the domain layer.
 */
export class StockMovement {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly movementType: MovementTypes,
    public readonly quantity: number,
    public readonly previousStock: number,
    public readonly newStock: number,
    public readonly reference: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
