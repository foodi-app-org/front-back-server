import { Module } from '../entities/modules.entity'


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
}
