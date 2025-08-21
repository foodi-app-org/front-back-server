
/**
 * SalesRepository defines the contract for interacting with sales data.
 */
export interface SalesRepository {
  /**
   * Counts the number of sales within a date range.
   * @param start Start date for filtering sales.
   * @param end End date for filtering sales.
   * @returns Total number of sales.
   */
  countSales(start: Date, end: Date): Promise<number>

  // /**
  //  * Persists a new sale.
  //  * @param sale Sale entity to save.
  //  * @returns The persisted Sale entity.
  //  */
  // save(sale: Sale): Promise<Sale>

  // /**
  //  * Finds a sale by its unique identifier.
  //  * @param id Sale ID.
  //  * @returns The found Sale or null if not found.
  //  */
  // findById(id: string): Promise<Sale | null>

  // /**
  //  * Deletes a sale by ID.
  //  * @param id Sale ID.
  //  * @returns True if deleted, false otherwise.
  //  */
  // delete(id: string): Promise<boolean>
}
