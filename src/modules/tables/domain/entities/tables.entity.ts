/**
 * Represents the current state of a table.
 */
export enum TableStateEnum {
  UNAVAILABLE = 0,
  ACTIVE = 1,
  OCCUPIED = 2
}

/**
 * Domain entity representing a restaurant table.
 */
export class Table {
  constructor(
    public readonly tableId: string | undefined,
    public tableName: string,
    public seats: number,
    public section: string,
    public tableState: TableStateEnum = TableStateEnum.ACTIVE,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validate()
  }

  private validate(): void {
    if (!this.tableName?.trim()) {
      throw new Error('Table name is required')
    }

    if (
      !Number.isInteger(this.seats) ||
      this.seats <= 0
    ) {
      throw new Error(
        'Table seats must be a positive integer'
      )
    }

    if (
      !Object.values(TableStateEnum).includes(
        this.tableState
      )
    ) {
      throw new Error('Invalid table state')
    }
  }
}