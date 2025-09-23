import { Clients } from '../../domain/entities/clients.entity'
import { ClientsRepository } from '../../domain/repositories/clients.repository'

/**
 * Response structure for CreateClientUseCase.
 */
interface CreateClientResponse {
  success: boolean;
  message: string;
  data: Clients[];
}

/**
 * Use case responsible for creating a new Client (represents a Client in a Store).
 */
export class GetAllClientUseCase {
  constructor(
    private readonly clientsRepository: ClientsRepository
  ) {}

  /**
   * Executes the use case to create a new client (Client).
   * @param input - The client entity containing the table data.
   * @returns The created Client or an error message.
   */
  async execute(idStore: string): Promise<CreateClientResponse | null> {
    try {
      // Persist in repository
      const data = await this.clientsRepository.getAll(idStore)

      return data
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unexpected error occurred',
        data: []
      }
    }
  }
}
