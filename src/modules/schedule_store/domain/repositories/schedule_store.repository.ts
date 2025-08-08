import { ScheduleStore } from '../entities/schedule_store.entity'

/**
 * Interface for Store repository access.
 */
export interface ScheduleStoreRepository {
  /**
   * Creates a new store in the data source.
   * @param schedule - Store entity to be created.
   * @returns The created Store or null if failed.
   */
  create(schedule: ScheduleStore): Promise<ScheduleStore | null>;

  /**
   * Finds a store by its day.
   * @param day - Day of the week (0-6).
   * @returns Store if found, otherwise null.
   */
  findByDay(day: number): Promise<ScheduleStore | null>;

  /**
 * Updates a store by its id.
 * @param schId - UUID of the schedule to update.
 * @param updateData - Partial schedule data to update.
 * @returns Updated ScheduleStore or null if not found.
 */
  update(schId: string, updateData: Partial<ScheduleStore>): Promise<ScheduleStore | null>;

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
