import { Clients } from '../entities/clients.entity'

/**
 * Repository interface for managing Clients.
 */
export interface ClientsRepository {
  /**
   * Creates a new Table.
   * @param table - Table entity to be created.
   * @returns The created Table or null if failed.
   */
  create(table: Clients): Promise<Clients | null>
}
