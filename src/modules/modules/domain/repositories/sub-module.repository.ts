import { Submodule } from '../entities/sub-modules.entity'


/**
 * Interface for the Module repository.
 */
export interface SubmoduleRepository {
  /**
   * Creates a new subModule in the data source.
   * @param module - Module entity to be created.
   * @returns The created Module or null if failed.
   */
  create(module: Submodule): Promise<Submodule | null>;
}
