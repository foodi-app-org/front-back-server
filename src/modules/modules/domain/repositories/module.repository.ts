import { Module } from '../entities/modules.entity'

/**
 * Single module ordering instruction: which module and its new priority.
 */
export interface ModuleOrderItem {
  mId: string
  mPriority: number
}

/**
 * Interface for the Module repository.
 */
export interface ModuleRepository {
  /**
   * Creates a new Module in the data source.
   * @param module - Module entity to be created.
   * @returns The created Module or null if failed.
   */
  create(module: Module): Promise<Module | null>;

  getAll(): Promise<Module[]>;

  /**
   * Persists a new ordering for a set of modules.
   *
   * Every item is applied atomically (all or nothing): if any update fails the
   * whole operation is rolled back so the ordering never ends up half applied.
   *
   * @param items - List of `{ mId, mPriority }` pairs to apply.
   * @returns The affected modules after the update.
   */
  updateOrder(items: ModuleOrderItem[]): Promise<Module[]>;
}
