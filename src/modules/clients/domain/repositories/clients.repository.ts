import { Clients, ClientsPagination } from '../entities/clients.entity'

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

  /**
   * Retrieves all Clients.
   * @returns An array of Clients or null if no clients found.
   */
  getAll(idStore: string): Promise<ClientsPagination | null>

}
