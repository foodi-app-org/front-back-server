import { Table } from '../entities/tables.entity'

/**
 * Repository interface for managing Tables.
 */
export interface TableRepository {
  /**
   * Creates a new Table.
   * @param table - Table entity to be created.
   * @returns The created Table or null if failed.
   */
  create(table: Table): Promise<Table | null>

  // /**
  //  * Finds a Table by its ID.
  //  * @param id - Table UUID.
  //  * @returns The Table or null if not found.
  //  */
  // findById(id: string): Promise<Table | null>

  // /**
  //  * Lists all Tables for a Store.
  //  * @returns Array of Tables.
  //  */
  // findAll(): Promise<Table[]>

  // /**
  //  * Updates a Table.
  //  * @param table - Table entity with updated data.
  //  * @returns The updated Table or null if failed.
  //  */
  // update(table: Table): Promise<Table | null>

  // /**
  //  * Deletes a Table by ID.
  //  * @param id - Table UUID.
  //  * @returns true if deleted, false otherwise.
  //  */
  // delete(id: string): Promise<boolean>
}
