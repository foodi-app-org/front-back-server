import { Clients } from '../../domain/entities/clients.entity'
import { ClientsRepository } from '../../domain/repositories/clients.repository'

/**
 * Response structure for FindClientUseCase.
 */
interface FindOneClientResponse {
  success: boolean;
  message: string;
  data: Clients | null;
}

/**
 * Use case responsible for creating a new Client (represents a Client in a Store).
 */
export class FindClientByLegalIdUseCase {
  constructor(
    private readonly clientsRepository: ClientsRepository
  ) {}

  /**
   * Executes the use case to create a new client (Client).
   * @param input - The client entity containing the table data.
   * @returns The created Client or an error message.
   */
  async execute(legalId: string): Promise<FindOneClientResponse | null> {
    try {
      // Persist in repository
      const data = await this.clientsRepository.findByLegalId(legalId)
      return {
        success: true,
        message: 'Client found successfully',
        data: data
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unexpected error occurred',
        data: null
      }
    }
  }
}
