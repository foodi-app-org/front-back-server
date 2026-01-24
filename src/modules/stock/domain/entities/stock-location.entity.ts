/**
 * Entity that represents a Stock Location.
 */
export class StockLocation {
  constructor(
    public readonly id: string,
    public readonly idStore: string,
    public readonly name: string, // 
    public readonly description: string | null,
    public readonly type: string, // 'PREP' SALE STORAGE DAMAGED TRANSIT 
    public readonly priority?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
