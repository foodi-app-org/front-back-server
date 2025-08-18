
enum TableStateEnum {
  UNAVAILABLE = 0,
  ACTIVE = 1,
  OCCUPIED = 2
}

/**
 * Domain entity representing a Table inside a Store.
 */
export class Table {
  constructor(
    public readonly tableId: string,
    public tableName: string,
    public seats: number,
    public section: string,
    public tableState: TableStateEnum,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}