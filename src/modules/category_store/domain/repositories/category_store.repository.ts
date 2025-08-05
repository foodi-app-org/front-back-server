import { CategoryStore } from '../entities/category_store.entity'

/**
 * Interface for CategoryStore repository access.
 */
export interface CategoryStoreRepository {
  /**
   * Creates a new store in the data source.
   * @param store - Store entity to be created.
   * @returns The created CategoryStore or null if failed.
   */
  create(categoryStore: CategoryStore): Promise<CategoryStore | null>;

  /**
   * Finds a store by its email.
   * @param email - Email of the store to find.
   * @returns CategoryStore if found, otherwise null.
   */
  findByID(id: string): Promise<CategoryStore | null>;

  /**
   * Retrieves all stores.
   * @returns Array of CategoryStore entities.
   */
  getAll(): Promise<CategoryStore[]>;

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
