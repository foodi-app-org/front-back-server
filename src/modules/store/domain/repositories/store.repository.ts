import { Store } from '../entities/store.entity'

/**
 * Interface for Store repository access.
 */
export interface StoreRepository {
  /**
   * Creates a new store in the data source.
   * @param store - Store entity to be created.
   * @returns The created Store or null if failed.
   */
  create(store: Store): Promise<Store | null>;

  /**
   * Finds a store by its email.
   * @param email - Email of the store.
   * @returns Store if found, otherwise null.
   */
  findByEmail(email: string): Promise<Store | null>;

  // /**
  //  * Finds a store by its unique identifier.
  //  * @param idStore - UUID of the store.
  //  * @returns Store if found, otherwise null.
  //  */
  // findById(idStore: string): Promise<Store | null>;

  // /**
  //  * Retrieves all stores.
  //  * @returns Array of Store entities.
  //  */
  // getAll(): Promise<Store[]>;

  // /**
  //  * Updates store data by id.
  //  * @param idStore - UUID of the store to update.
  //  * @param updateData - Partial store data to update.
  //  * @returns Updated Store or null if not found.
  //  */
  // updateById(idStore: string, updateData: Partial<Store>): Promise<Store | null>;

  // /**
  //  * Deletes a store by its id.
  //  * @param idStore - UUID of the store to delete.
  //  * @returns True if deleted, false otherwise.
  //  */
  // deleteById(idStore: string): Promise<boolean>;

  // /**
  //  * Checks if a store with the given email exists.
  //  * @param email - Store email to check.
  //  * @returns True if exists, false otherwise.
  //  */
  // existsByEmail(email: string): Promise<boolean>;
}
