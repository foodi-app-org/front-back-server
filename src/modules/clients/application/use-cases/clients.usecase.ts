import { Clients } from '../../domain/entities/clients.entity'
import { ClientsRepository } from '../../domain/repositories/clients.repository'

/**
 * Response structure for CreateClientUseCase.
 */
interface CreateClientResponse {
  success: boolean;
  message: string;
  data: Clients | null;
}

/**
 * Use case responsible for creating a new Client (represents a Client in a Store).
 */
export class CreateClientUseCase {
  constructor(
    private readonly clientsRepository: ClientsRepository
  ) { }

  /**
  /**
   * Executes the use case to create a new client (Client).
   * @param input - The client entity containing the table data.
   * @returns The created Client or an error message.
   */
  async execute(input: Clients): Promise<CreateClientResponse> {
    // Build entity with default handling for nullables
    const table = new Clients(
      input.cliId,
      input.idStore,
      input.idUser ?? null,
      input.clState ?? 1,
      input.gender ?? 0,
      input.clientAddress ?? null,
      input.clientNumber ?? null,
      input.clientName ?? null,
      input.clientLastName ?? null,
      input.ccClient ?? null,
      input.createdAt ?? new Date(),
      input.updatedAt ?? new Date()
    )

    // Persist in repository
    const created = await this.clientsRepository.create(table)

    return {
      success: true,
      message: 'Client created successfully',
      data: created
    }
  }
}